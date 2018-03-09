export default function geoEvent() {
  $(document).on("click", "#getLocation", function () {
    console.log("boom")
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
      });
    } else {
      this.innerHTML = "Geolocation is not supported by this browser.";
    }
  });
};
