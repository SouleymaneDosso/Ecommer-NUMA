import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

/* ---------------- PAGE ---------------- */

const Page = styled.div`
display:flex;
flex-direction:column;
gap:80px;
padding-bottom:80px;
font-family:Inter, sans-serif;
`;

/* ---------------- HERO ---------------- */

const Hero = styled.section`
height:90vh;
position:relative;
overflow:hidden;
`;

const HeroImg = styled.img`
width:100%;
height:100%;
object-fit:cover;
`;

const HeroOverlay = styled.div`
position:absolute;
inset:0;
background:linear-gradient(
to bottom,
rgba(0,0,0,0.1),
rgba(0,0,0,0.6)
);
`;

const HeroText = styled.div`
position:absolute;
bottom:80px;
left:60px;
color:white;
max-width:400px;

h1{
font-size:3rem;
font-weight:600;
letter-spacing:-1px;
}

p{
margin-top:10px;
opacity:.9;
}

a{
display:inline-block;
margin-top:20px;
padding:12px 24px;
background:white;
color:black;
text-decoration:none;
font-weight:500;
}
`;

/* ---------------- COLLECTIONS ---------------- */

const Collections = styled.section`
display:grid;
grid-template-columns:1fr 1fr;
gap:12px;
padding:0 20px;

@media(max-width:768px){
grid-template-columns:1fr;
}
`;

const CollectionCard = styled.div`
position:relative;
overflow:hidden;
border-radius:12px;

img{
width:100%;
height:450px;
object-fit:cover;
transition:transform .6s;
}

&:hover img{
transform:scale(1.08);
}

a{
position:absolute;
bottom:30px;
left:30px;
background:white;
padding:12px 22px;
text-decoration:none;
color:black;
font-weight:500;
}
`;

/* ---------------- PRODUITS ---------------- */

const SectionTitle = styled.h2`
text-align:center;
font-weight:600;
font-size:1.8rem;
`;

const Products = styled.section`
max-width:1100px;
margin:auto;
display:grid;
grid-template-columns:repeat(4,1fr);
gap:20px;
padding:0 20px;

@media(max-width:900px){
grid-template-columns:repeat(2,1fr);
}

@media(max-width:500px){
grid-template-columns:1fr;
}
`;

const ProductCard = styled(Link)`
text-decoration:none;
color:black;
display:flex;
flex-direction:column;
gap:8px;
`;

const ProductImg = styled.img`
width:100%;
height:260px;
object-fit:cover;
border-radius:10px;

transition:transform .3s;

${ProductCard}:hover &{
transform:scale(1.05);
}
`;

const Title = styled.p`
font-size:.95rem;
font-weight:500;
`;

const Price = styled.p`
font-size:.9rem;
color:#666;
`;

/* ---------------- BANNER ---------------- */

const Banner = styled.section`
height:380px;
background:#111;
color:white;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
text-align:center;

h2{
font-size:2rem;
margin-bottom:10px;
}

p{
opacity:.8;
}

a{
margin-top:20px;
padding:12px 24px;
background:white;
color:black;
text-decoration:none;
}
`;

/* ---------------- COMPONENT ---------------- */

export default function Home(){

const [products,setProducts] = useState([])

useEffect(()=>{

fetch(`${import.meta.env.VITE_API_URL}/api/produits`)
.then(res=>res.json())
.then(data=>setProducts(data))

},[])

const img = (p)=>{
if(!p.images?.length) return ""
const url = p.images[0].url
return url.startsWith("http")
? url
: `${import.meta.env.VITE_API_URL}${url}`
}

const hero = products.find(p=>p.hero)

const homme = products.find(p=>p.genre?.trim().toLowerCase()==="homme")

const femme = products.find(p=>p.genre?.trim().toLowerCase()==="femme")

const populaires = products.slice(0,4)

return(

<Page>

{/* HERO */}

{hero && (

<Hero>

<HeroImg src={img(hero)} />

<HeroOverlay/>

<HeroText>

<h1>Nouvelle Collection</h1>

<p>
Découvrez nos vêtements modernes
pensés pour le style et le confort.
</p>

<Link to="/collections">
Découvrir
</Link>

</HeroText>

</Hero>

)}

{/* COLLECTIONS */}

<Collections>

{homme && (

<CollectionCard>

<img src={img(homme)} />

<Link to="/homme">
Collection Homme
</Link>

</CollectionCard>

)}

{femme && (

<CollectionCard>

<img src={img(femme)} />

<Link to="/femme">
Collection Femme
</Link>

</CollectionCard>

)}

</Collections>

{/* PRODUITS */}

<SectionTitle>
Produits populaires
</SectionTitle>

<Products>

{populaires.map(p=>(

<ProductCard
key={p._id}
to={`/produit/${p._id}`}
>

<ProductImg src={img(p)} />

<Title>{p.titre}</Title>

<Price>{p.prix} FCFA</Price>

</ProductCard>

))}

</Products>

{/* BANNER */}

<Banner>

<h2>Style moderne & qualité</h2>

<p>
Des vêtements conçus pour durer
et pour vous accompagner chaque jour.
</p>

<Link to="/collections">
Explorer la collection
</Link>

</Banner>

</Page>

)

}