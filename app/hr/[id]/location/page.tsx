"use client";

import {
  useEffect,
  useState,
} from "react";

export default function LocationPage() {

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    locations,
    setLocations,
  ] = useState<any[]>([]);

  const [
    nearbyPlaces,
    setNearbyPlaces,
  ] = useState<string[]>([]);

  const [
    currentPlace,
    setCurrentPlace,
  ] = useState("");

  // FETCH LOCATIONS
  async function fetchLocations() {

    try {

      const user =
        JSON.parse(
          localStorage.getItem(
            "user"
          ) || "{}"
        );

      const res =
        await fetch(
          "/api/location"
        );

      const data =
        await res.json();

      if (data.success) {

        const filtered =
          data.locations.filter(
            (item: any) =>
              item.branchName ===
              user.branchName
          );

        setLocations(
          filtered
        );
      }

    } catch (error) {

      console.log(error);
    }
  }

  useEffect(() => {
    fetchLocations();
  }, []);

  // GET NEARBY PLACES
  async function getNearbyPlaces(
    latitude: number,
    longitude: number,
    currentLocation: string
  ) {

    try {

      const query = `
        [out:json];
        (
          node(around:3000,${latitude},${longitude})["place"];
        );
        out;
      `;

      const res =
        await fetch(
          "https://overpass-api.de/api/interpreter",
          {
            method: "POST",
            body: query,
          }
        );

      const data =
        await res.json();

      // UNIQUE PLACE NAMES
      const uniquePlaces =
        [
          ...new Set(
            data.elements
              .map(
                (item: any) =>
                  item.tags?.name
              )
              .filter((place: unknown): place is string => Boolean(place))
          ),
        ] as string[];

      // REMOVE CURRENT LOCATION
      const filteredPlaces =
        uniquePlaces.filter(
          (place) =>
            place !==
            currentLocation
        );

      setNearbyPlaces(
        filteredPlaces
      );

    } catch (error) {

      console.log(error);
    }
  }

  // GET GPS LOCATION
  async function getLocation() {

    if (
      !navigator.geolocation
    ) {

      alert(
        "Geolocation not supported"
      );

      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        try {

          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          // GET PLACE NAME
          const locationRes =
            await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );

          const locationData =
            await locationRes.json();

          // CURRENT PLACE
          const placeName =
            locationData.address
              .village ||

            locationData.address
              .hamlet ||

            locationData.address
              .suburb ||

            locationData.address
              .town ||

            locationData.address
              .city ||

            "Unknown";

          setCurrentPlace(
            placeName
          );

          // GET USER
          const user =
            JSON.parse(
              localStorage.getItem(
                "user"
              ) || "{}"
            );

          // SAVE LOCATION
          const res =
            await fetch(
              "/api/location",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  latitude,

                  longitude,

                  address:
                    placeName,

                  branchName:
                    user.branchName,

                  employeeName:
                    user.name,

                  employeeEmail:
                    user.email,
                }),
              }
            );

          const data =
            await res.json();

          if (data.success) {

            // GET NEARBY PLACES
            await getNearbyPlaces(
              latitude,
              longitude,
              placeName
            );

            fetchLocations();

            alert(
              "Location Saved Successfully"
            );
          }

        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);
        }

      },

      (error) => {

        console.log(error);

        alert(
          "Location permission denied"
        );

        setLoading(false);
      }
    );
  }

  return (

    <div className="min-h-screen bg-gray-50 p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">

          <div>

            <h1 className="text-3xl font-bold">
              Employee Locations
            </h1>

            <p className="text-gray-500 mt-1">
              Track employee live locations
            </p>

          </div>

          <button
            onClick={getLocation}
            disabled={loading}
            className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold"
          >

            {loading
              ? "Getting Location..."
              : "Get My Location"}

          </button>

        </div>

        {/* CURRENT LOCATION */}
        {currentPlace && (

          <div className="bg-white rounded-2xl shadow border p-6 mb-6">

            <h2 className="text-xl font-bold mb-2">
              Current Location
            </h2>

            <div className="bg-black text-white inline-block px-5 py-2 rounded-full">
              {currentPlace}
            </div>

          </div>
        )}

        {/* NEARBY PLACES */}
        {nearbyPlaces.length >
          0 && (

          <div className="bg-white rounded-2xl shadow border p-6 mb-8">

            <h2 className="text-xl font-bold mb-4">
              Nearby Places Within 3KM
            </h2>

            <div className="flex flex-wrap gap-3">

              {nearbyPlaces.map(
                (
                  place,
                  index
                ) => (

                  <div
                    key={index}
                    className="bg-black text-white px-4 py-2 rounded-full text-sm"
                  >
                    {place}
                  </div>
                )
              )}

            </div>

          </div>
        )}

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow border overflow-hidden">

          <table className="w-full">

            <thead className="bg-black text-white">

              <tr>

                <th className="p-4 text-left">
                  Employee
                </th>

                <th className="p-4 text-left">
                  Email
                </th>

                <th className="p-4 text-left">
                  Branch
                </th>

                <th className="p-4 text-left">
                  Location
                </th>

                <th className="p-4 text-left">
                  Map
                </th>

              </tr>

            </thead>

            <tbody>

              {locations.length ===
              0 ? (

                <tr>

                  <td
                    colSpan={5}
                    className="p-8 text-center text-gray-400"
                  >
                    No locations found
                  </td>

                </tr>

              ) : (

                locations.map(
                  (
                    item,
                    index
                  ) => (

                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-4 font-medium">
                        {
                          item.employeeName
                        }
                      </td>

                      <td className="p-4">
                        {
                          item.employeeEmail
                        }
                      </td>

                      <td className="p-4">
                        {
                          item.branchName
                        }
                      </td>

                      <td className="p-4">
                        {
                          item.address
                        }
                      </td>

                      <td className="p-4">

                        <a
                          href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                          target="_blank"
                          className="bg-black text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Open Map
                        </a>

                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}