const uploadBox =
  document.getElementById("uploadBox");

const imageInput =
  document.getElementById("imageInput");

const previewImage =
  document.getElementById("previewImage");

const uploadContent =
  document.getElementById("uploadContent");

const generateBtn =
  document.getElementById("generateBtn");

const resultImage =
  document.getElementById("resultImage");

const placeholder =
  document.getElementById("placeholder");

const itemsContainer =
  document.getElementById("itemsContainer");

const itemsGrid =
  document.getElementById("itemsGrid");

const promptInput =
  document.getElementById("prompt");

uploadBox.addEventListener("click", () => {
  imageInput.click();
});

imageInput.addEventListener("change", e => {

  const file = e.target.files[0];

  if(!file) return;

  const reader = new FileReader();

  reader.onload = event => {

    previewImage.src = event.target.result;

    previewImage.style.display = "block";

    uploadContent.style.display = "none";

  };

  reader.readAsDataURL(file);

});

generateBtn.addEventListener("click", () => {

  const prompt =
    promptInput.value.toLowerCase();

  let roomImage =
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";

  if(prompt.includes("gaming")){

    roomImage =
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80";

  }

  if(prompt.includes("luxury")){

    roomImage =
      "https://images.unsplash.com/photo-1616594039964-3d5d8c5c0f6b?auto=format&fit=crop&w=1200&q=80";

  }

  if(prompt.includes("study")){

    roomImage =
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80";

  }

  placeholder.classList.add("hidden");

  resultImage.classList.remove("hidden");

  resultImage.src = roomImage;

  itemsContainer.classList.remove("hidden");

  itemsGrid.innerHTML = "";

  const items = [

    {
      name:"Modern Desk",
      image:
        "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
      desc:"Minimal wooden desk setup",
      price:"$120"
    },

    {
      name:"Floor Lamp",
      image:
        "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80",
      desc:"Warm cozy lighting",
      price:"$80"
    },

    {
      name:"Indoor Plant",
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
      desc:"Natural room aesthetic",
      price:"$35"
    },

    {
      name:"Modern Rug",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
      desc:"Soft cozy texture",
      price:"$95"
    }

  ];

  items.forEach(item => {

    const card =
      document.createElement("div");

    card.className = "item-card";

    card.innerHTML = `
    
      <img src="${item.image}">

      <div class="item-content">

        <h3>${item.name}</h3>

        <p>${item.desc}</p>

        <div class="price">
          ${item.price}
        </div>

      </div>

    `;

    itemsGrid.appendChild(card);

  });

});
