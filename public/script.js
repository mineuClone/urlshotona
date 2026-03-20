const link = document.getElementById("link");

async function shortenLink() {
  const res = await fetch(`/shorten?link=${link.value}`, { method: "POST" });
  res.json().then((link =>{
    console.log(link.link);
  }))
}
