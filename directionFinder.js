let map;
let service;
let infowindow;

function initMap() {
  // Default location: New York City
  const defaultLocation = { lat: 40.7128, lng: -74.0060 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 14,
  });

  infowindow = new google.maps.InfoWindow();

  // Try browser geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const userLocation = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      map.setCenter(userLocation);
      findNearbyCafes(userLocation);
    });
  } else {
    findNearbyCafes(defaultLocation);
  }
}

function findNearbyCafes(location) {
  const request = {
    location: location,
    radius: 1500, // 1.5 km
    type: ["cafe"],
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(
      `<strong>${place.name}</strong><br>Rating: ${place.rating || "N/A"}`
    );
    infowindow.open(map, marker);
  });
}

function searchLocation() {
  const input = document.getElementById("locationInput").value;
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address: input }, (results, status) => {
    if (status === "OK") {
      map.setCenter(results[0].geometry.location);
      findNearbyCafes(results[0].geometry.location);
    } else {
      alert("Geocode failed: " + status);
    }
  });
}
