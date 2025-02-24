// The HandleComponent is a simple functional component that renders a small circular handle.
// This handle is typically used as a resize or drag handle in draggable/resizable UI elements.
const HandleComponent = () => {
  return (
    // The <div> below has several Tailwind CSS classes:
    // - "w-5": Sets the width of the div to 1.25rem (approx 20px).
    // - "h-5": Sets the height of the div to 1.25rem, making it a square.
    // - "rounded-full": Applies full border-radius making the div into a circle.
    // - "shadow": Adds a subtle box shadow to give a lifted appearance.
    // - "border": Adds a border around the div.
    // - "bg-white": Sets the background color to white.
    // - "border-zinc-200": Sets the border color to a light gray (Zinc-200 shade).
    // - "transition": Enables smooth transitions for any property changes (like hover effects).
    // - "hover:bg-primary": Changes the background color to the primary color when the mouse hovers over the handle.
    <div className="w-5 h-5 rounded-full shadow border bg-white border-zinc-200 transition hover:bg-primary" />
  );
};

export default HandleComponent;
