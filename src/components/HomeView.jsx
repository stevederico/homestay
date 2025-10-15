import Header from '@stevederico/skateboard-ui/Header';
import { useEffect, useState, useRef } from "react";
import { getBackendURL, timestampToString, isSubscriber } from '@stevederico/skateboard-ui/Utilities';
import constants from '@/constants.json';

export default function HomeView() {
  const [objects, setObjects] = useState([]);
  const [originalObjects, setOriginalObjects] = useState([]);
  
  useEffect(() => {
    getData();
  }, []);

  async function getData(){
    await fetch(`${getBackendURL()}/listings`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((response) => {
      if (response.status === 200) {
        return response.json()
      } else {
        console.log("Error fetching listings: ", response)
        return null
      }
    }).then((data) => {
      if (data) {
        console.log("Fetched listings: ", data)
        setObjects(data);
        setOriginalObjects(data);
      }
    })
  }

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    if (!query) {
      console.log("Search cleared, resetting to original objects");
      setObjects(originalObjects);
      return;
    }
    const filtered = originalObjects.filter(
      (object) =>
        object.title?.toLowerCase().includes(query) ||
        object.description?.toLowerCase().includes(query) ||
        object.location?.toLowerCase().includes(query)
    );
    setObjects(filtered);
  };

  return (
    <>
      <div className="p-4">
        <input
          type="text"
          placeholder="Search..."
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-accent focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="p-4 bg-background min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {objects.map((object, index) => (
            <div
              key={index}
              onClick={() => window.location.href = `/app/r/${object._id}`}
              className="cursor-pointer p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-accent hover:shadow-lg transition-shadow"
            >
              {object.photos?.[0] && (
                <img
                  src={object.photos[0]}
                  alt={object.title}
                  className="w-full h-48 object-cover rounded-t-lg mb-2"
                />
              )}
              <h2 className="font-bold text-xl mb-2">{object.title}</h2>
              <p className="mb-2">{object.location}</p>
            </div>
          ))}
        </div>
      </div>

    </>
  )
}
