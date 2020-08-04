const form = document.getElementById("fontUrl");

form.addEventListener("input", function (event) {
  const font = "https://fonts.adobe.com/fonts/";
  const fontCollection = "https://fonts.adobe.com/collections/";

  if (form.validity.typeMismatch) {
    form.setCustomValidity("Please enter a URL.");
  } else if (form.value.length <= 30) {
    form.setCustomValidity("This URL does not point to a font.");
  } else if (
    !form.value.includes(font) &&
    !form.value.includes(fontCollection)
  ) {
    form.setCustomValidity("This URL does not point to Adobe Fonts.");
  }
});
