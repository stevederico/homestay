import Header from '@stevederico/skateboard-ui/Header';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from "react";
import { getBackendURL, timestampToString, isSubscriber } from '@stevederico/skateboard-ui/Utilities';
import constants from '@/constants.json';

export default function DetailView() {
  const { id } = useParams();
  const [details, setDetails] = useState({ title: '', description: ''});
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  function getNights() {
    if (!checkIn || !checkOut) return 0;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diff = (outDate - inDate) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  }

  function getTotalPrice() {
    const nights = getNights();
    if (!details.price || nights === 0) return null;
    return details.price * nights;
  }

  useEffect(() => {
    getData();
  }, [id]);


  async function getData(){
    await fetch(`${getBackendURL()}/listings/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((response) => {
      if (response.status === 200) {
        return response.json()
      } else {
        console.log("Error fetching details: ", response)
        return null
      }
    }).then((data) => {
      if (data) {
        console.log("Fetched details: ", data)
        setDetails(data);
      }
    })
  }



  return (
    <>
      <div className="p-4 bg-background">
        {/* Photo Gallery */}
        {details.photos && details.photos.length > 0 && (
          <div className="flex flex-row overflow-x-auto gap-4 mb-6 w-full">
            {details.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`${details.title} ${index + 1}`}
                className="h-128 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        )}

        {/* Main Info */}
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div>
            <h1 className="text-4xl font-light mb-2">{details.title}</h1>
            <p className="text-lg mb-2">{details.location}</p>
            <p className="mb-2">{details.bedrooms} Bedroom(s) | {details.bathrooms} Bathroom(s) | {details.squareFootage} sq ft</p>
          </div>
          <div className="flex flex-col items-left bg-accent p-4 rounded-lg shadow-md min-w-[260px] w-full max-w-xs items-left">
            {getNights() > 0 && getTotalPrice() ? (
              <p className="text-2xl font-semibold mb-4">${getTotalPrice()} for {getNights()} night{getNights() > 1 ? 's' : ''}</p>
            ) : (
              <p className="text-2xl font-semibold mb-4">${details.price} / night</p>
            )}
            <div className="flex w-full gap-2 mb-2">
              <div className="flex flex-col w-1/2">
                <label htmlFor="checkin" className="text-xs mb-1">Check-in</label>
                <input id="checkin" type="date" className="px-2 py-1 rounded border border-gray-300 bg-background w-full" value={checkIn} onChange={e => setCheckIn(e.target.value)} max={checkOut || undefined} />
              </div>
              <div className="flex flex-col w-1/2">
                <label htmlFor="checkout" className="text-xs mb-1">Check-out</label>
                <input id="checkout" type="date" className="px-2 py-1 rounded border border-gray-300 bg-background w-full" value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn || undefined} />
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mt-2 cursor-pointer">
              Reserve
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">About this space</h2>
          <p className="text-lg">{details.description}</p>
        </div>

        {/* Amenities */}
        {details.amenities && details.amenities.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Amenities</h2>
            <ul className="grid grid-cols-2 gap-2">
              {details.amenities.map((amenity, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2">✓</span> {amenity}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Policies and Rules */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Rental Policy</h2>
            <p>{details.rentalPolicy}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Cancellation Policy</h2>
            <p>{details.cancellationPolicy}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">House Rules</h2>
            <p>{details.houseRules}</p>
          </div>
        </div>

        {/* Contact Info */}
        {details.contactInfo && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Host Contact</h2>
            <p>Name: {details.contactInfo.name}</p>
            <p>Phone: {details.contactInfo.phone}</p>
            <p>Email: {details.contactInfo.email}</p>
          </div>
        )}
      </div>
    </>
  );
}
