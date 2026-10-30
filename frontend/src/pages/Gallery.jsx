function Gallery() {
 const images = [
 "https://picsum.photos/seed/techfest1/400/300",
 "https://picsum.photos/seed/techfest2/400/300",
 "https://picsum.photos/seed/techfest3/400/300",
 "https://picsum.photos/seed/techfest4/400/300",
 "https://picsum.photos/seed/techfest5/400/300",
 "https://picsum.photos/seed/techfest6/400/300"
 ];

 return (
 <div className="page">
 <div className="page-header">
 <h1>GALLERY</h1>
 </div>
 <div className="gallery-grid">
 {images.map((src, index) => (
 <div key={index} className="gallery-item">
 <img src={src} alt="TechFest" />
 </div>
 ))}
 </div>
 </div>
 );
}

export default Gallery;
