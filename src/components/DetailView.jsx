import Header from '@stevederico/skateboard-ui/Header';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from "react";
import { getBackendURL, getCookie, timestampToString, isSubscriber } from '@stevederico/skateboard-ui/Utilities';

export default function DetailView() {
  const { id } = useParams();
  const [details, setDetails] = useState({ title: '', description: ''});
  
  useEffect(() => {
    getData();
  }, [id]);


  async function getData(){
    await fetch(`${getBackendURL()}/listings/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getCookie('token')}`,
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {details.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`${details.title} ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        )}

        {/* Main Info */}
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{details.title}</h1>
            <p className="text-lg mb-2">{details.location}</p>
            <p className="mb-2">{details.bedrooms} Bedroom(s) | {details.bathrooms} Bathroom(s) | {details.squareFootage} sq ft</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${details.price} / night</p>
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

        {/* Placeholder for Booking Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-accent p-4 shadow-t-md">
          <div className="container mx-auto flex justify-end">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Reserve
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
