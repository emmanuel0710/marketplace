import React, { useState, useEffect } from 'react';
import { getUserType } from '../utils/auth'; // Assume this utility retrieves the user type from local storage or API
import '../style/dashboard.css';

const MarketplaceDashboard = () => {
  const [userType, setUserType] = useState('');
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [sellerName, setSellerName] = useState('');
  const [chatVisible, setChatVisible] = useState({});
  const [chatMessages, setChatMessages] = useState({});
  const [chatInput, setChatInput] = useState({});
  const [comments, setComments] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [reviews, setReviews] = useState({});
  const [ratings, setRatings] = useState({});
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [shippingMethod, setShippingMethod] = useState('');

  useEffect(() => {
    const type = getUserType();
    setUserType(type);
    
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        const data = await response.json();
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery) {
        try {
          const response = await fetch(`http://localhost:3000/api/products/search?query=${searchQuery}`);
          const data = await response.json();
          setFilteredPosts(data);
        } catch (error) {
          console.error('Error searching products:', error);
        }
      } else {
        setFilteredPosts(posts);
      }
    };

    fetchSearchResults();
  }, [searchQuery, posts]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadResponse = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('File upload failed');
      }

      const uploadResult = await uploadResponse.text();
      const productData = {
        title,
        description,
        file: uploadResult,
        sellerName,
      };

      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const savedPost = await response.json();
        setPosts(prevPosts => [...prevPosts, savedPost]);
        setFilteredPosts(prevFilteredPosts => [...prevFilteredPosts, savedPost]);
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }

    setTitle('');
    setDescription('');
    setFile(null);
    setSellerName('');
  };

  const handleCommentSubmit = (postId, e) => {
    e.preventDefault();
    const commentText = e.target.elements.comment.value;
    setComments(prevComments => ({
      ...prevComments,
      [postId]: [...(prevComments[postId] || []), commentText],
    }));
    e.target.reset();
  };

  const handleChatSubmit = (postId, e) => {
    e.preventDefault();
    const message = chatInput[postId];
    setChatMessages(prevMessages => ({
      ...prevMessages,
      [postId]: [...(prevMessages[postId] || []), message],
    }));
    setChatInput({ ...chatInput, [postId]: '' });
  };

  const handleReviewSubmit = (postId, e) => {
    e.preventDefault();
    const reviewText = e.target.elements.review.value;
    const rating = e.target.elements.rating.value;
    setReviews(prevReviews => ({
      ...prevReviews,
      [postId]: [...(prevReviews[postId] || []), reviewText],
    }));
    setRatings(prevRatings => ({
      ...prevRatings,
      [postId]: [...(prevRatings[postId] || []), rating],
    }));
    e.target.reset();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setUserType('');
    window.location.href = '/login';
  };

  const handleBuyNow = (postId) => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
    } else {
      setSelectedPost(postId);
      setShowPurchaseModal(true);
    }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleShippingMethodChange = (e) => {
    setShippingMethod(e.target.value);
  };

  const handlePurchase = async () => {
    // Implement the purchase logic here
    // You can make API calls to your backend to process the payment and shipping
    console.log('Purchase successful!');
    setShowPurchaseModal(false);
  };

  return (
    <div>
      <header>
        <h5>Second-Hand Marketplace</h5>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main>
        <input 
          type="search" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          placeholder="Search for items" 
        />

        {userType === 'seller' && (
          <section>
            <h6>Post an Item</h6>
            <form onSubmit={handlePostSubmit}>
              <input
                type="text"
                placeholder="Product Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              /><br /><br />
              <textarea
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              /><br /><br />
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files[0])}
                required
              /><br /><br />
              <input
                type="text"
                placeholder="Your Name"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                required
              /><br /><br />
              <button type="submit">Post Item</button>
            </form>
          </section>
        )}

        <section>
          <h7>Available Items</h7>
          <div id="posts">
            {filteredPosts.map((post, index) => (
              <div className="post" key={index}>
                <h8>{post.title}</h8>
                <p>{post.description}</p>
                {post.file && <img src={`http://localhost:3000/uploads/${post.file}`} alt="Product" style={{ width: '100%', height: 'auto', borderRadius: '5px' }} />}
                <p>Sold by: {post.sellerName}</p>
                

                {/* Comment section */}
                <h9>Comments</h9>
                <ul>
                  {(comments[post._id] || []).map((comment, i) => (
                    <li key={i}>{comment}</li>
                  ))}
                </ul>
                {userType === 'buyer' && (
                  <form onSubmit={(e) => handleCommentSubmit(post._id, e)}>
                    <input type="text" name="comment" placeholder="Add a comment" />
                    <button type="submit">Comment</button>
                  </form>
                )}

                {/* Chat interface for messaging the seller */}
                {userType === 'buyer' && (
                  <div>
                    <button onClick={() => setChatVisible({ ...chatVisible, [post._id]: !chatVisible[post._id] })}>
                      {chatVisible[post._id] ? 'Hide Chat' : 'Message Seller'}
                    </button>
                    {chatVisible[post._id] && (
                      <div>
                        <h10>Chat with {post.sellerName}</h10>
                        <ul>
                          {(chatMessages[post._id] || []).map((message, i) => (
                            <li key={i}>{message}</li>
                          ))}
                        </ul>
                        <form onSubmit={(e) => handleChatSubmit(post._id, e)}>
                          <input 
                            type="text" 
                            value={chatInput[post._id]} 
                            onChange={(e) => setChatInput({ ...chatInput, [post ._id]: e.target.value })} 
                          />
                          <button type="submit">Send</button>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* Review and Rating section */}

                {userType === 'buyer' && (
                  <div>
                    <h11>Reviews and Ratings</h11>
                    <ul>
                      {(reviews[post._id] || []).map((review, i) => (
                        <li key={i}>{review}</li>
                      ))}
                    </ul>
                    <p>Average Rating: {getAverageRating(post._id, ratings)}</p>
                    <form onSubmit={(e) => handleReviewSubmit(post._id, e)}>
                      <input type="text" name="review" placeholder="Add a review" />
                      <select name="rating">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                      <button type="submit">Submit Review</button>
                    </form>
                  </div>
                )}
                  {/* Buy Now button */}
                  {userType === 'buyer' && (
                  <button onClick={() => handleBuyNow(post._id)}>Buy Now</button>
                )}

              </div>
            ))}
          </div>
        </section>

        {showPurchaseModal && (
          <div className="purchase-modal">
            <h12>Purchase Details</h12>
            <p>Product: {selectedPost && filteredPosts.find(post => post._id === selectedPost).title}</p>
            <p>Seller: {selectedPost && filteredPosts.find(post => post._id === selectedPost).sellerName}</p>
            <form>
              <label>Payment Method:</label>
              <select value={paymentMethod} onChange={handlePaymentMethodChange}>
                <option value="gcash">GCash</option>
                <option value="paymaya">PayMaya</option>
                <option value="cod">Cash on Delivery</option>
              </select>
              <br />
              <label>Shipping Method:</label>
              <select value={shippingMethod} onChange={handleShippingMethodChange}>
                <option value="jt">J&T</option>
                <option value="flash">Flash Express</option>
              </select>
              <br />
              <button type="button" onClick={handlePurchase}>Purchase</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

const getAverageRating = (postId, ratings) => {
  const ratingsForPost = ratings[postId] || [];
  if (ratingsForPost.length === 0) {
    return 0;
  }
  const sum = ratingsForPost.reduce((acc, current) => acc + parseInt(current), 0);
  return sum / ratingsForPost.length;
};

export default MarketplaceDashboard;