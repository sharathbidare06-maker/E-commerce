import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { API } from './config/api';
import { fallbackProducts } from './data/fallbackProducts';
import './styles.css';

const money = (value) => `INR ${Number(value).toLocaleString('en-IN')}`;

function App() {
    const [products, setProducts] = useState(fallbackProducts);
    const [cart, setCart] = useState([]);
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [sort, setSort] = useState('featured');
    const [wishlist, setWishlist] = useState([]);
    const [orderStatus, setOrderStatus] = useState('Connecting');
    const [catalogStatus, setCatalogStatus] = useState('Connecting');
    const [lastSync, setLastSync] = useState(null);
    const [adminOpen, setAdminOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: 'Work tech', imageUrl: '' });
    const [adminMessage, setAdminMessage] = useState('');
    const [checkoutMessage, setCheckoutMessage] = useState('');
    const [orders, setOrders] = useState([]);
    const [view, setView] = useState('catalog');
    const [shipment, setShipment] = useState(null);
    const [toast, setToast] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [reviewMessage, setReviewMessage] = useState('');
    const [checkoutDetails, setCheckoutDetails] = useState({ customerEmail: '', deliveryAddress: '' });
        const [session, setSession] = useState(() => JSON.parse(localStorage.getItem('avenlo-session') || 'null'));
        const [authOpen, setAuthOpen] = useState(false);
        const [authMode, setAuthMode] = useState('login');
        const [authRole, setAuthRole] = useState('CUSTOMER');
        const [authForm, setAuthForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
        const [authInviteCode, setAuthInviteCode] = useState('');
        const [authMessage, setAuthMessage] = useState('');
        const [authPending, setAuthPending] = useState(false);
        const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetch(`${API}/api/products`).then((response) => response.json()).then((data) => { setProducts(data.length ? data : fallbackProducts); setCatalogStatus('Live'); setLastSync(new Date()); }).catch(() => setCatalogStatus('Offline'));
        fetch(`${API}/api/cart`).then((response) => response.json()).then((data) => setCart(data.items || [])).catch(() => setCart([]));
        fetch(`${API}/api/orders`).then((response) => response.json()).then((data) => { setOrders(data); setOrderStatus(data.length ? data[data.length - 1].status : 'Ready'); }).catch(() => setOrders([]));
    }, []);

    useEffect(() => {
        const latestOrder = orders[orders.length - 1];
        if (latestOrder) fetch(`${API}/api/shipping/${latestOrder.id}`).then((response) => response.json()).then(setShipment).catch(() => setShipment(null));
    }, [orders]);

    useEffect(() => {
        if (!selectedProduct) return undefined;
        setReviews([]);
        setReviewMessage('Loading reviews...');
        setReviewForm({ rating: 5, comment: '' });
        fetch(`${API}/api/reviews/product/${selectedProduct.id}`).then((response) => response.json()).then((data) => { setReviews(data); setReviewMessage(''); }).catch(() => setReviewMessage('Reviews are unavailable right now.'));
        return undefined;
    }, [selectedProduct]);

    useEffect(() => {
        const events = new EventSource(`${API}/api/products/stream`);
        events.addEventListener('catalog-update', (event) => { setProducts(JSON.parse(event.data)); setCatalogStatus('Live'); setLastSync(new Date()); });
        events.onerror = () => setCatalogStatus('Offline');
        return () => events.close();
    }, []);

    useEffect(() => {
        const events = new EventSource(`${API}/api/orders/stream`);
        events.addEventListener('order-status', (event) => { setOrderStatus(JSON.parse(event.data).status); setLastSync(new Date()); });
        events.onerror = () => setOrderStatus('Offline');
        return () => events.close();
    }, []);

    useEffect(() => {
        if (!toast) return undefined;
        const timer = setTimeout(() => setToast(''), 2800);
        return () => clearTimeout(timer);
    }, [toast]);

    const essentialNames = new Set(['Laptop', 'Mechanical keyboard', 'Wireless mouse', 'Desk setup', 'Headphones', 'Charging station', 'Canvas backpack', 'Insulated bottle']);
    const categories = [...new Set(['All', 'Work tech', 'Essentials', ...products.map((product) => product.category || 'Essentials')])];
    const visibleProducts = useMemo(() => {
        const filtered = products.filter((product) => {
            const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
            const matchesCategory = category === 'All' || (category === 'Essentials' ? essentialNames.has(product.name) : (product.category || 'Essentials') === category);
            return matchesQuery && matchesCategory;
        });
        return [...filtered].sort((left, right) => {
            if (sort === 'price-low') return left.price - right.price;
            if (sort === 'price-high') return right.price - left.price;
            return left.id - right.id;
        });
    }, [products, query, category, sort]);
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const lastSyncLabel = lastSync ? `Updated ${lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Waiting for sync';
    const isCustomer = session?.role === 'CUSTOMER';
    const sessionName = [session?.firstName, session?.lastName].filter(Boolean).join(' ') || session?.email?.split('@')[0] || '';
    let authSubmitLabel = 'Customer login';
    if (authRole === 'ADMIN') authSubmitLabel = 'Admin login';
    if (authMode === 'register') authSubmitLabel = authRole === 'ADMIN' ? 'Create admin account' : 'Create customer account';
    const authTitle = authMode === 'login' ? 'Welcome back.' : 'Create your account.';
    let authCopy = 'Sign in to save your bag, order products, and track delivery.';
    if (authRole === 'ADMIN') authCopy = 'Sign in to manage the live Avenlo collection.';
    if (authMode === 'register') authCopy = authRole === 'ADMIN'
        ? 'Create a trusted operations account with your private invite code.'
        : 'Create an account to save your bag, order products, and track delivery.';

    const navigate = (nextView) => { setView(nextView); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
        const openAdmin = () => { if (session?.role === 'ADMIN') setAdminOpen(true); else { setAuthRole('ADMIN'); setAuthMode('login'); setAuthOpen(true); } };
        const authenticate = async (event) => {
            event.preventDefault();
            setAuthPending(true);
            setAuthMessage(authMode === 'register' ? 'Creating your account...' : 'Signing you in...');
            try {
                const endpoint = authMode === 'register' ? 'register' : 'login';
                const response = await fetch(`${API}/api/auth/${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...authForm, role: authRole, inviteCode: authInviteCode }) });
                if (!response.ok) {
                    let detail = '';
                    try { detail = (await response.json()).message || ''; } catch { /* response may not be JSON */ }
                    throw new Error(detail || (response.status === 409 ? 'That email is already registered.' : 'The email or password is incorrect.'));
                }
                const account = await response.json();
                if (authRole === 'ADMIN' && account.role !== 'ADMIN') throw new Error('This account does not have admin access.');
                localStorage.setItem('avenlo-session', JSON.stringify(account));
                setSession(account);
                setAuthOpen(false);
                setAuthMessage('');
                setToast(`Signed in as ${account.role.toLowerCase()}`);
            } catch (error) { setAuthMessage(error.message || 'We could not complete that request. Please try again.'); }
            finally { setAuthPending(false); }
        };
        const signOut = () => { localStorage.removeItem('avenlo-session'); setSession(null); setAdminOpen(false); setToast('Signed out'); };
    const requireCustomer = () => {
        if (isCustomer) return true;
        setAuthRole('CUSTOMER');
        setAuthMode('login');
        setAuthOpen(true);
        return false;
    };
    const addToCart = async (product) => {
        if (!requireCustomer()) return;
        const response = await fetch(`${API}/api/cart`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` }, body: JSON.stringify({ productId: product.id, productName: product.name, price: product.price, quantity: 1, imageUrl: product.imageUrl }) });
        if (response.ok) { const data = await response.json(); setCart(data.items || []); setToast(`${product.name} added to bag`); }
    };
    const removeFromCart = async (item) => {
        if (!requireCustomer()) return;
        const response = await fetch(`${API}/api/cart/${item.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${session.token}` } });
        if (response.ok) setCart((await response.json()).items || []);
    };
    const updateCartQuantity = async (item, quantity) => {
        if (!requireCustomer()) return;
        const response = await fetch(`${API}/api/cart/${item.id}?cartId=guest`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` }, body: JSON.stringify({ quantity }) });
        if (response.ok) setCart((await response.json()).items || []);
    };
    const checkout = async () => {
        if (!requireCustomer()) return;
        if (!checkoutDetails.customerEmail || !checkoutDetails.deliveryAddress) {
            setCheckoutMessage('Enter your email and delivery address before checkout.');
            return;
        }
        setCheckoutMessage('Creating order...');
        try {
            const orderResponse = await fetch(`${API}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` }, body: JSON.stringify({ total: cartTotal, customerEmail: checkoutDetails.customerEmail, deliveryAddress: checkoutDetails.deliveryAddress }) });
            if (!orderResponse.ok) throw new Error('order');
            const order = await orderResponse.json();
            const paymentResponse = await fetch(`${API}/api/payments`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` }, body: JSON.stringify({ orderId: order.id, amount: cartTotal }) });
            if (!paymentResponse.ok) throw new Error('payment');
            const shippingResponse = await fetch(`${API}/api/shipping`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` }, body: JSON.stringify({ orderId: order.id, address: checkoutDetails.deliveryAddress }) });
            if (!shippingResponse.ok) throw new Error('shipping');
            const createdShipment = await shippingResponse.json();
            setShipment(createdShipment);
            await Promise.all(cart.map((item) => fetch(`${API}/api/cart/${item.id}`, { method: 'DELETE' })));
            setCart([]);
            setOrders((items) => [...items, order]);
            setCheckoutMessage(`Payment complete. Tracking ${createdShipment.trackingNumber}.`);
        } catch { setCheckoutMessage('Checkout is unavailable. Please try again.'); }
    };
    const createProduct = async (event) => {
        event.preventDefault();
        setAdminMessage('Saving...');
        try {
            const response = await fetch(`${API}/api/products`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.token || ''}` }, body: JSON.stringify({ name: newProduct.name, price: Number(newProduct.price), stock: Number(newProduct.stock), category: newProduct.category, imageUrl: newProduct.imageUrl }) });
            if (!response.ok) throw new Error('Could not save product');
            setNewProduct({ name: '', price: '', stock: '', category: 'Work tech', imageUrl: '' });
            setAdminMessage('Product added. The collection is live.');
        } catch { setAdminMessage('Could not save product. Start the backend first.'); }
    };
    const submitReview = async (event) => {
        event.preventDefault();
        if (!requireCustomer() || !selectedProduct) return;
        setReviewMessage('Publishing review...');
        try {
            const response = await fetch(`${API}/api/reviews`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` }, body: JSON.stringify({ productId: selectedProduct.id, rating: Number(reviewForm.rating), comment: reviewForm.comment }) });
            if (!response.ok) throw new Error('review');
            const review = await response.json();
            setReviews((items) => [review, ...items]);
            setReviewForm({ rating: 5, comment: '' });
            setReviewMessage('Your review is live.');
        } catch { setReviewMessage('Could not publish your review. Please try again.'); }
    };

    return <div className="app-shell">
        <div className="announcement"><span>Complimentary delivery on orders over INR 2,000</span><span className="announcement-link">Shop the edit <span aria-hidden="true">-&gt;</span></span></div>
        <header className="topbar">
            <button className="mobile-menu-button" aria-label="Open menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><span /><span /></button>
            <button className="brand" onClick={() => navigate('catalog')}><span className="brand-mark">A</span><span>Avenlo</span></button>
            <nav className={mobileMenuOpen ? 'main-nav is-open' : 'main-nav'}>
                <button className={view === 'catalog' ? 'nav-tab is-active' : 'nav-tab'} onClick={() => navigate('catalog')}>Shop</button>
                <button className={view === 'orders' ? 'nav-tab is-active' : 'nav-tab'} onClick={() => navigate('orders')}>Orders</button>
                <button className={view === 'shipping' ? 'nav-tab is-active' : 'nav-tab'} onClick={() => navigate('shipping')}>Track order</button>
                <button className="nav-tab admin-nav" onClick={openAdmin}>Admin</button>
            </nav>
            <div className="header-actions"><button className="icon-button" aria-label="Search" onClick={() => navigate('catalog')}>Search</button>{session ? <div className="account-cluster"><span className="session-user" title={session.email}><strong>{sessionName}</strong><small>{session.role === 'ADMIN' ? 'Administrator' : 'Customer'}</small></span><button className="account-button" onClick={session.role === 'ADMIN' ? () => setAdminOpen(true) : signOut}>{session.role === 'ADMIN' ? 'Open admin' : 'Sign out'}</button></div> : <button className="account-button" onClick={() => { setAuthRole('CUSTOMER'); setAuthMode('login'); setAuthOpen(true); }}>Sign in</button>}<button className="bag-button" onClick={() => navigate('cart')}>Bag <span>{cartCount}</span></button></div>
        </header>

        <main id="top">
            {view === 'catalog' && <>
                <section className="hero">
                    <div className="hero-copy"><p className="eyebrow">THE EVERYDAY EDIT / 2025</p><h1>Objects for a life <em>well made.</em></h1><p className="hero-text">Considered essentials for your desk, your downtime, and everywhere in between.</p><button className="primary-button" onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}>Explore the collection <span>-&gt;</span></button><div className="hero-meta"><span><strong>01</strong> Curated</span><span><strong>02</strong> Delivered</span><span><strong>03</strong> Loved</span></div></div>
                    <div className="hero-art"><img src={fallbackProducts[0].imageUrl} alt="Laptop on a bright modern desk" /><div className="hero-sticker"><span>New season</span><strong>Work<br />better.</strong></div><div className="hero-caption">01 / 03 <span>Modern work essentials</span></div></div>
                </section>
                <section className="signal-row"><div><span className="signal-dot" /> Store systems live</div><p>Inventory updates as it happens</p><div className="order-pill">Latest order <strong>{orderStatus}</strong></div></section>
                <section className="catalog" id="catalog">
                    <div className="section-heading"><div><p className="eyebrow">THE COLLECTION</p><h2>Find your next favorite.</h2></div><p className="collection-note">Useful things, beautifully chosen.<br />Built for the rhythm of real life.</p></div>
                    <div className="catalog-tools"><div className="category-tabs">{categories.map((item) => <button key={item} className={category === item ? 'category-tab is-active' : 'category-tab'} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="tool-right"><span className="live-label"><span className={`mini-dot ${catalogStatus === 'Live' ? '' : 'is-offline'}`} /> {catalogStatus} <small>{lastSyncLabel}</small></span><label className="search"><span>Search</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" aria-label="Search products" /></label><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></div></div>
                    <div className="results-line"><span>{visibleProducts.length} pieces</span><span>Showing the current edit</span></div><div className="product-grid">{visibleProducts.map((product, index) => <article className="product-card" key={product.id}><div className="product-image"><img src={product.imageUrl || fallbackProducts[index % fallbackProducts.length].imageUrl} alt={product.name} /><span className="product-badge">{product.badge || (index === 0 ? 'Featured' : 'Essential')}</span><button className={wishlist.includes(product.id) ? 'wishlist is-saved' : 'wishlist'} aria-label={`Save ${product.name}`} onClick={() => setWishlist((items) => items.includes(product.id) ? items.filter((id) => id !== product.id) : [...items, product.id])}>Save</button><button className="quick-view" onClick={() => setSelectedProduct(product)}>Quick view</button></div><div className="product-info"><div><p className="product-type">{product.category || 'ESSENTIALS'}</p><h3>{product.name}</h3><p className="stock-label"><span /> {product.stock || 0} available</p></div><strong className="price">{money(product.price)}</strong></div><button className="add-button" onClick={() => addToCart(product)}>{isCustomer ? 'Add to bag' : 'Sign in to shop'} <span>+</span></button></article>)}</div>{!visibleProducts.length && <div className="empty-state"><strong>No pieces found.</strong><span>Try another search or browse every category.</span></div>}
                </section>
                <section className="service-strip"><div><strong>Free delivery</strong><span>On orders over INR 2,000</span></div><div><strong>30-day returns</strong><span>Simple, stress-free returns</span></div><div><strong>Need help?</strong><span>hello@avenlo.store</span></div><div><strong>Secure checkout</strong><span>Protected from cart to door</span></div></section>
            </>}
            {view === 'orders' && <section className="page-section order-page"><div className="page-intro"><p className="eyebrow">ORDER HISTORY</p><h1>Your latest orders.</h1><p className="hero-text">Payment and fulfillment updates, all in one place.</p></div><div className="order-list">{orders.length ? orders.slice(-10).reverse().map((order) => <div className="order-row" key={order.id}><span>Order #{order.id}</span><strong>{order.status}</strong><span>{money(order.total)}</span></div>) : <p className="empty-state">No orders yet.</p>}</div></section>}
            {view === 'shipping' && <section className="page-section shipping-page"><div className="page-intro"><p className="eyebrow">DELIVERY TRACKING</p><h1>On its way to you.</h1><p className="hero-text">Follow the latest shipment from payment to delivery.</p></div>{shipment ? <div className="shipment-card"><span className="shipment-icon">-&gt;</span><p className="product-type">LATEST SHIPMENT</p><h2>{shipment.trackingNumber}</h2><strong>{shipment.status.replace('_', ' ')}</strong><p>Order #{shipment.orderId}</p></div> : <p className="empty-state">Complete an order to see shipping details.</p>}</section>}
            {view === 'cart' && <section className="page-section cart-page"><div className="page-intro"><p className="eyebrow">YOUR BAG / {cartCount} ITEMS</p><h1>Ready when you are.</h1><p className="hero-text">Your selected pieces are saved and ready for checkout.</p></div><div className="cart-page-list">{cart.length ? cart.map((item) => <div className="cart-item" key={item.id}><div><strong>{item.productName}</strong><span>Quantity {item.quantity}</span><div className="quantity-controls"><button type="button" aria-label={`Decrease ${item.productName}`} onClick={() => updateCartQuantity(item, item.quantity - 1)}>-</button><strong>{item.quantity}</strong><button type="button" aria-label={`Increase ${item.productName}`} onClick={() => updateCartQuantity(item, item.quantity + 1)}>+</button></div></div><strong>{money(item.price * item.quantity)} <button type="button" className="remove-item" onClick={() => removeFromCart(item)}>Remove</button></strong></div>) : <p className="empty-state">Your bag is empty.</p>}{cart.length > 0 && <><div className="checkout-details"><label>Email for order updates<input required type="email" value={checkoutDetails.customerEmail} onChange={(event) => setCheckoutDetails({ ...checkoutDetails, customerEmail: event.target.value })} placeholder="you@example.com" /></label><label>Delivery address<textarea required value={checkoutDetails.deliveryAddress} onChange={(event) => setCheckoutDetails({ ...checkoutDetails, deliveryAddress: event.target.value })} placeholder="Street, city, postal code" /></label></div><div className="cart-total"><span>Total</span><strong>{money(cartTotal)}</strong></div><button className="primary-button checkout" onClick={checkout}>Checkout <span>-&gt;</span></button></>}{checkoutMessage && <p className="admin-message">{checkoutMessage}</p>}</div></section>}
        </main>
        {selectedProduct && <div className="review-backdrop"><section className="review-panel" aria-labelledby="reviews-title"><div className="review-panel-head"><div><p className="eyebrow">COMMUNITY NOTES</p><h2 id="reviews-title">Reviews for {selectedProduct.name}</h2></div><span>{reviews.length} review{reviews.length === 1 ? '' : 's'}</span></div>{reviewMessage && !reviews.length && <p className="review-status">{reviewMessage}</p>}{reviews.length > 0 && <div className="review-list">{reviews.map((review) => <article className="review-item" key={review.id}><div className="review-item-head"><strong>{'★'.repeat(review.rating)}</strong><span>Verified customer</span></div><p>{review.comment}</p></article>)}</div>}{isCustomer ? <form className="review-form" onSubmit={submitReview}><label>Your rating<select value={reviewForm.rating} onChange={(event) => setReviewForm({ ...reviewForm, rating: event.target.value })}><option value="5">5 / 5</option><option value="4">4 / 5</option><option value="3">3 / 5</option><option value="2">2 / 5</option><option value="1">1 / 5</option></select></label><label>Your review<textarea required maxLength="1000" value={reviewForm.comment} onChange={(event) => setReviewForm({ ...reviewForm, comment: event.target.value })} placeholder="What did you think?" /></label><button className="primary-button" type="submit">Publish review <span>-&gt;</span></button>{reviewMessage && reviews.length > 0 && <p className="review-status">{reviewMessage}</p>}</form> : <p className="review-sign-in">Sign in as a customer to share your experience.</p>}</section></div>}
        <footer className="site-footer"><div className="footer-top"><div><button className="brand footer-brand" onClick={() => navigate('catalog')}><span className="brand-mark">A</span><span>Avenlo</span></button><p>Useful things for a life well made.</p></div><div className="footer-links"><div><strong>Shop</strong><button onClick={() => navigate('catalog')}>All products</button><button onClick={() => { setCategory('Work tech'); navigate('catalog'); }}>Work tech</button><button onClick={() => { setCategory('Workspace'); navigate('catalog'); }}>Workspace</button></div><div><strong>Help</strong><button onClick={() => navigate('orders')}>Orders</button><button onClick={() => navigate('shipping')}>Track delivery</button><button onClick={openAdmin}>Catalog admin</button></div><div><strong>Follow along</strong><span>Instagram</span><span>Pinterest</span><span>Journal</span></div></div></div><div className="footer-bottom"><span>© 2025 Avenlo</span><span>Made for better everyday work.</span></div></footer>
        {toast && <output className="toast"><span>OK</span>{toast}</output>}
        {authOpen && <div className="auth-backdrop"><dialog open className="auth-dialog" aria-labelledby="auth-title"><button className="close" aria-label="Close sign in" onClick={() => setAuthOpen(false)}>Close</button><div className="auth-mark">A</div><p className="eyebrow">{authRole === 'ADMIN' ? 'AVENLO ADMIN' : 'AVENLO ACCOUNT'}</p><h2 id="auth-title">{authTitle}</h2><p className="auth-copy">{authCopy}</p><div className="auth-switch"><button type="button" className={authRole === 'CUSTOMER' ? 'is-active' : ''} onClick={() => { setAuthRole('CUSTOMER'); setAuthMessage(''); }}>Customer</button><button type="button" className={authRole === 'ADMIN' ? 'is-active' : ''} onClick={() => { setAuthRole('ADMIN'); setAuthMessage(''); }}>Admin</button></div><div className="auth-mode-switch"><button type="button" className={authMode === 'login' ? 'is-active' : ''} onClick={() => { setAuthMode('login'); setAuthMessage(''); }}>Sign in</button><button type="button" className={authMode === 'register' ? 'is-active' : ''} onClick={() => { setAuthMode('register'); setAuthMessage(''); }}>Create account</button></div><form onSubmit={authenticate}>{authMode === 'register' && <div className="name-fields"><label>First name<input required autoComplete="given-name" value={authForm.firstName} onChange={(event) => setAuthForm({ ...authForm, firstName: event.target.value })} placeholder="First name" /></label><label>Last name<input required autoComplete="family-name" value={authForm.lastName} onChange={(event) => setAuthForm({ ...authForm, lastName: event.target.value })} placeholder="Last name" /></label></div>}<label>Email<input required autoComplete="email" type="email" value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} placeholder="you@example.com" /></label><label>Password<div className="password-field"><input required minLength="8" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} type={showPassword ? 'text' : 'password'} value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} placeholder="At least 8 characters" /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></div></label>{authRole === 'ADMIN' && authMode === 'register' && <label>Admin invite code<input required type="password" value={authInviteCode} onChange={(event) => setAuthInviteCode(event.target.value)} placeholder="Provided by the platform owner" /></label>}<button className="primary-button" disabled={authPending} type="submit">{authPending ? 'Please wait...' : authSubmitLabel} <span>-&gt;</span></button></form>{authRole === 'ADMIN' && authMode === 'register' && <p className="auth-note">Admin accounts are stored securely after the invite code is verified. Never share the code publicly.</p>}{authMessage && <p className={authMessage.includes('...') ? 'auth-status' : 'auth-status is-error'} role="alert">{authMessage}</p>}</dialog></div>}
        {selectedProduct && <div className="quick-view-backdrop"><dialog open className="quick-view-panel" aria-labelledby="quick-view-title"><button className="close" aria-label="Close quick view" onClick={() => setSelectedProduct(null)}>Close</button><img src={selectedProduct.imageUrl || fallbackProducts[0].imageUrl} alt={selectedProduct.name} /><div className="quick-view-copy"><p className="eyebrow">{selectedProduct.category || 'ESSENTIALS'}</p><h2 id="quick-view-title">{selectedProduct.name}</h2><strong className="quick-view-price">{money(selectedProduct.price)}</strong><p>Designed to earn its place in your everyday setup. Available now, with complimentary delivery on qualifying orders.</p><div className="quick-view-meta"><span><strong>In stock</strong>{selectedProduct.stock || 0} available</span><span><strong>Dispatch</strong>Within 48 hours</span></div><button className="primary-button" onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}>Add to bag <span>-&gt;</span></button></div></dialog></div>}
        {adminOpen && <div className="drawer-backdrop"><dialog open className="admin-drawer admin-console" aria-labelledby="admin-title"><button className="close" aria-label="Close admin panel" onClick={() => setAdminOpen(false)}>Close</button><div className="admin-console-head"><div><p className="eyebrow">AVENLO OPERATIONS</p><h2 id="admin-title">Catalog control center</h2><p className="drawer-copy">Manage the live collection and keep an eye on store health.</p></div><span className="admin-live"><span className={`mini-dot ${catalogStatus === 'Live' ? '' : 'is-offline'}`} /> {catalogStatus}</span></div><div className="admin-metrics"><div><span>Products</span><strong>{products.length}</strong><small>in catalog</small></div><div><span>Units available</span><strong>{products.reduce((total, product) => total + (product.stock || 0), 0)}</strong><small>across products</small></div><div><span>Orders</span><strong>{orders.length}</strong><small>recorded</small></div></div><div className="admin-workspace"><div><div className="admin-section-title"><strong>Current catalog</strong><span>Live inventory</span></div><div className="admin-product-list">{products.slice(0, 6).map((product) => <div className="admin-product-row" key={product.id}><img src={product.imageUrl || fallbackProducts[0].imageUrl} alt="" /><span><strong>{product.name}</strong><small>{product.category || 'Essentials'}</small></span><b>{product.stock || 0}</b><small>units</small></div>)}</div></div><div className="admin-form-wrap"><div className="admin-section-title"><strong>Add product</strong><span>Publish to store</span></div><form onSubmit={createProduct}><label>Name<input required value={newProduct.name} onChange={(event) => setNewProduct({ ...newProduct, name: event.target.value })} placeholder="Product name" /></label><label>Category<select value={newProduct.category} onChange={(event) => setNewProduct({ ...newProduct, category: event.target.value })}><option>Work tech</option><option>Workspace</option><option>Audio</option><option>Mobile</option><option>Carry</option><option>Everyday</option><option>Home</option></select></label><label>Price<input required min="0" type="number" value={newProduct.price} onChange={(event) => setNewProduct({ ...newProduct, price: event.target.value })} placeholder="INR" /></label><label>Stock<input required min="0" type="number" value={newProduct.stock} onChange={(event) => setNewProduct({ ...newProduct, stock: event.target.value })} placeholder="Units" /></label><label>Image URL<input required type="url" placeholder="https://images.unsplash.com/..." value={newProduct.imageUrl} onChange={(event) => setNewProduct({ ...newProduct, imageUrl: event.target.value })} /></label><button className="primary-button" type="submit">Publish product <span>Publish</span></button></form>{adminMessage && <p className="admin-message">{adminMessage}</p>}</div></div></dialog></div>}
    </div>;
}

createRoot(document.getElementById('root')).render(<App />);



