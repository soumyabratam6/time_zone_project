document.addEventListener("DOMContentLoaded", () => {
  const currentTimezoneDisplay = document.getElementById(
    "current-timezone-display"
  );

  // Fetch user's current timezone
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        try {
          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=7a225d2e80704c74a260913392dac518`
          );

          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();
          //console.log(JSON.stringify(data, null, 2));
          currentTimezoneDisplay.innerHTML = `<div class="time-zone">
                <div >Name Of Time Zone : ${data.features[0].properties.timezone.name}</div>
                <div class="lat-lon"><div>Lat:${data.features[0].properties.lat}</div><div id="lon">Lat:${data.features[0].properties.lon}</div></div>
                <div>Offset STD:${data.features[0].properties.timezone.offset_STD}</div>
                <div>Offset STD Seconds:${data.features[0].properties.timezone.offset_DST_seconds}</div>
                <div>Offset DST:${data.features[0].properties.timezone.offset_DST}</div>
                <div>Offset DST Seconds: :${data.features[0].properties.timezone.offset_DST_seconds}</div>
                <div>Country:${data.features[0].properties.country}</div>
                <div>Postcode:${data.features[0].properties.postcode}</div>
                <div>City:${data.features[0].properties.city}</div>
                </div>`;
        } catch (error) {
          currentTimezoneDisplay.textContent = `Error fetching timezone information: ${error.message}`;
        }
      },
      (error) => {
        currentTimezoneDisplay.textContent = `Geolocation error: ${error.message}`;
      }
    );
  } else {
    currentTimezoneDisplay.textContent =
      "Geolocation not supported by this browser.";
  }

  // Fetch timezone based on entered address
  document
    .getElementById("get-timezone-button")
    .addEventListener("click", async () => {
      const address = document.getElementById("address-input").value;
      const addressTimezoneDisplay = document.getElementById(
        "address-timezone-display"
      );
      if (!address) {
        addressTimezoneDisplay.textContent = "Please enter a valid address.";
        return;
      }

      try {
        const geocodeResponse = await fetch(
          `https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=7a225d2e80704c74a260913392dac518`
        );
        if (!geocodeResponse.ok) throw new Error("Network response was not ok");
        const geocodeData = await geocodeResponse.json();
        //console.log(JSON.stringify(geocodeData, null, 2));

        if (geocodeData.features.length === 0) {
          addressTimezoneDisplay.textContent = "Address not found.";
          addressTimezoneDisplay.style.color = "red";
          return;
        }
        const lat = geocodeData.features[0].geometry.coordinates[1];
        const lon = geocodeData.features[0].geometry.coordinates[0];
        const timezoneResponse = await fetch(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=7a225d2e80704c74a260913392dac518`
        );
        if (!timezoneResponse.ok)
          throw new Error("Network response was not ok");
        const timezoneData = await timezoneResponse.json();
        //console.log(JSON.stringify(timezoneData, null, 2));

        addressTimezoneDisplay.innerHTML = `<div class="addre-zone">
            <div><h2>Result</h2></div>
            <div>Timezone : ${timezoneData.features[0].properties.timezone.name}</div>
            <div class="lat-lon"><div>Lat:${timezoneData.features[0].properties.lat}</div><div>Lon:${timezoneData.features[0].properties.lon}</div></div>
            <div>Offset STD:${timezoneData.features[0].properties.timezone.offset_STD}</div>
                <div>Offset STD Seconds:${timezoneData.features[0].properties.timezone.offset_DST_seconds}</div>
                <div>Offset DST:${timezoneData.features[0].properties.timezone.offset_DST}</div>
                <div>Offset DST Seconds: :${timezoneData.features[0].properties.timezone.offset_DST_seconds}</div>
                <div>Country:${timezoneData.features[0].properties.country}</div>
                <div>Postcode:${timezoneData.features[0].properties.postcode}</div>
                <div>City:${timezoneData.features[0].properties.city}</div>
            </div>`;
      } catch (error) {
        addressTimezoneDisplay.textContent = `Error fetching timezone information: ${error.message}`;
      }
    });
});
