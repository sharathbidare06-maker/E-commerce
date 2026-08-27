import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
const API='http://localhost:8080';
function App(){
 const [products,setProducts]=useState([]);
 useEffect(()=>{fetch(API+'/api/products').then(r=>r.json()).then(setProducts).catch(()=>setProducts([]))},[]);
 return <><header><h1>ShopEasy</h1><nav>Home · Products · Cart · Orders</nav></header>
 <main><section className="hero"><h2>Modern E-Commerce</h2><p>Spring Boot microservices + React + PostgreSQL + Azure Blob.</p></section>
 <h2>Products</h2><div className="grid">{products.map(p=><article key={p.id}><h3>{p.name}</h3><p>₹{p.price}</p><button>Add to Cart</button></article>)}</div></main></>
}
createRoot(document.getElementById('root')).render(<App/>);
