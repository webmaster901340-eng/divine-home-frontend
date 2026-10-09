import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import Toast from '../components/Toast';
import { API_BASE_URL } from '../utils/api';

const isBulkCartLead = (lead) => {
  if (lead.leadType === 'bulk-cart' || lead.cartItems?.length > 0) return true;

  const instructions = lead.instructions || '';
  return instructions.includes('[BULK_CART_RFQ]') ||
    (instructions.includes('QUOTATION REQUEST:') && instructions.includes('SKU:'));
};

const FadeIn = ({ children, className = "", delay = 0, direction = "up" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.05 });

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const getTransform = () => {
    if (!isVisible) {
      if (direction === "up") return "translate-y-10 opacity-0";
      if (direction === "down") return "-translate-y-10 opacity-0";
      if (direction === "left") return "translate-x-10 opacity-0";
      if (direction === "right") return "-translate-x-10 opacity-0";
      if (direction === "zoom") return "scale-95 opacity-0";
    }
    return "translate-y-0 translate-x-0 scale-100 opacity-100";
  };

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transform transition-all duration-700 ease-out ${getTransform()} ${className}`}
    >
      {children}
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [reels, setReels] = useState([]);
  const [heroBanners, setHeroBanners] = useState([]);
  const [adminsList, setAdminsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingKeys, setUploadingKeys] = useState({});
  const [selectedLead, setSelectedLead] = useState(null);
  const [toast, setToast] = useState(null);
  const [pageImages, setPageImages] = useState(() => {
    const saved = localStorage.getItem('dhi_page_images');
    return saved ? JSON.parse(saved) : {
      about_hero: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&q=80&w=1920',
      about_img1: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
      about_img2: 'https://images.unsplash.com/photo-1581783342894-3ee46533f08b?auto=format&fit=crop&q=80&w=600',
      home_story: 'https://res.cloudinary.com/cm8nznam/image/upload/v1790070410/divine-home/designs/elite-series-peacockgrace.png',
      collections_artisan: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1920',
      collections_trays: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=1920',
      collections_organizers: 'https://images.unsplash.com/photo-1595521624a24-92b566bb01e8?auto=format&fit=crop&q=80&w=1920',
      collections_tableware: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&q=80&w=1920',
      collections_crockery: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=1920'
    };
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const navigate = useNavigate();
  const bulkCartLeads = leads.filter(isBulkCartLead);
  const nonCartLeads = leads.filter(lead => !isBulkCartLead(lead));

  const [categoriesList, setCategoriesList] = useState(() => {
    const saved = localStorage.getItem('dhi_admin_categories');
    return saved ? JSON.parse(saved) : [
      "Artisan Trays & Platters",
      "Ceramics & Tableware",
      "Luxury Home Décor",
      "Table Vases & Urns",
      "Bath & Vanity Sets"
    ];
  });

  const [seriesList, setSeriesList] = useState(() => {
    const saved = localStorage.getItem('dhi_admin_series');
    return saved ? JSON.parse(saved) : [
      "Ellite Series",
      "Leather Classic",
      "Mangowood Artistic",
      "Ceramic Storage Sets"
    ];
  });

  const [designNamesList, setDesignNamesList] = useState([]);
  const [loadingDesignNames, setLoadingDesignNames] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetch(`${API_BASE_URL}/api/admin/page-images`)
      .then(res => res.json())
      .then(data => {
        setPageImages({
          about_hero: data.about_hero,
          about_img1: data.about_img1,
          about_img2: data.about_img2,
          home_story: data.home_story,
          collections_artisan: data.collections_artisan,
          collections_trays: data.collections_trays,
          collections_organizers: data.collections_organizers,
          collections_tableware: data.collections_tableware,
          collections_crockery: data.collections_crockery
        });
      })
      .catch(err => {
        setToast({ message: 'Failed to load page images', type: 'error' });
      });

    fetch(`${API_BASE_URL}/api/design-names`)
      .then(res => res.json())
      .then(data => {
        const names = data.map(d => d.name);
        setDesignNamesList(names);
        if (names.length > 0 && !newProduct.designNo) {
          setNewProduct(prev => ({...prev, designNo: names[0]}));
        }
      })
      .catch(err => {
        setToast({ message: 'Failed to load design names', type: 'error' });
        setDesignNamesList(['3D Flower', 'Mandala', 'Gold Vector', 'Peacock']);
      })
      .finally(() => setLoadingDesignNames(false));
  }, [navigate]);

  const [currentUser] = useState(
    JSON.parse(localStorage.getItem('adminInfo')) || { name: 'Admin', role: 'admin' }
  );

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin'
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [editingReel, setEditingReel] = useState(null);

  const [newProduct, setNewProduct] = useState({
    title: '',
    category: categoriesList[0] || 'Artisan Trays & Platters',
    series: seriesList[0] || 'Ellite Series',
    designNo: '',
    wholesalePrice: '',
    mrp: '',
    moq: '30 pcs',
    sku: '',
    badge: '',
    images: [''],
    specs: {
      material: '',
      finish: '',
      dimensions: '',
      weight: '',
      packaging: ''
    }
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  const fetchData = () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => setToast({ message: 'Failed to load products', type: 'error' }));

    fetch(`${API_BASE_URL}/api/admin/leads`, { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => {
        setLeads(data);
        setContacts(data.filter(item => item.subject || item.instructions?.includes('Contact') || item.company?.includes('Inquiry')));
        setDealers(data.filter(item => item.quantity?.includes('50 trays') || item.company?.includes('Khurana') || item.instructions?.includes('Dealer')));
      })
      .catch(err => setToast({ message: 'Failed to load leads', type: 'error' }));

    fetch(`${API_BASE_URL}/api/reels`)
      .then(res => res.json())
      .then(data => setReels(data))
      .catch(err => setToast({ message: 'Failed to load reels', type: 'error' }));

    fetch(`${API_BASE_URL}/api/admin/hero-banners`, { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => setHeroBanners(data))
      .catch(err => setToast({ message: 'Failed to load banners', type: 'error' }));

    fetchAdmins();
    setLoading(false);
  };

  const fetchAdmins = () => {
    fetch(`${API_BASE_URL}/api/admin/list`, { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => setAdminsList(data))
      .catch(err => setToast({ message: 'Failed to load admins', type: 'error' }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  const handleCloudinaryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImage(true);
    const uploadedUrls = [...newProduct.images.filter(img => img !== '')];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'divine_preset');

      try {
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/cm8nznam/image/upload',
          {
            method: 'POST',
            body: formData,
          }
        );
        const data = await response.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      } catch (err) {
        setToast({ message: "Image upload failed", type: "error" });
      }
    }

    setNewProduct({ ...newProduct, images: uploadedUrls.length ? uploadedUrls : [''] });
    setUploadingImage(false);
  };

  const handleEditCloudinaryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImage(true);
    const uploadedUrls = [...(editingProduct.images || []).filter(img => img !== '')];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'divine_preset');

      try {
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/cm8nznam/image/upload',
          {
            method: 'POST',
            body: formData,
          }
        );
        const data = await response.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      } catch (err) {
        setToast({ message: "Image upload failed", type: "error" });
      }
    }

    setEditingProduct({ ...editingProduct, images: uploadedUrls.length ? uploadedUrls : [''] });
    setUploadingImage(false);
  };

  const handleCreateAdmin = (e) => {
    e.preventDefault();
    fetch(`${API_BASE_URL}/api/admin/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newAdmin)
    })
      .then(async res => {
        const data = await res.json();
        if (res.ok) {
          setToast({ message: "New admin created successfully!", type: "success" });
          setNewAdmin({ name: '', email: '', password: '', role: 'admin' });
          fetchAdmins();
        } else {
          setToast({ message: data.error || "Error creating admin", type: "error" });
        }
      })
      .catch(err => setToast({ message: "Error creating admin", type: "error" }));
  };

  const handleDeleteProduct = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Wholesale Product',
      message: 'Are you sure you want to delete this product from the catalog? This action cannot be undone.',
      onConfirm: () => {
        fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        })
          .then(res => res.json())
          .then(() => {
            setProducts(products.filter(p => p._id !== id));
            setToast({ message: 'Product deleted successfully', type: 'success' });
            setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
          })
          .catch(err => {
            setToast({ message: 'Error deleting product', type: 'error' });
            setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
          });
      }
    });
  };

  const openEditModal = (product) => {
    setEditingProduct({
      ...product,
      category: product.category || categoriesList[0],
      series: product.series || seriesList[0],
      designNo: product.designNo || '',
      images: product.images && product.images.length > 0 ? product.images : [''],
      specs: product.specs || {
        material: '',
        finish: '',
        dimensions: '',
        weight: '',
        packaging: ''
      }
    });
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    fetch(`${API_BASE_URL}/api/admin/products/${editingProduct._id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(editingProduct)
    })
      .then(res => res.json())
      .then(updated => {
        setProducts(products.map(p => p._id === updated._id ? updated : p));
        setEditingProduct(null);
        setToast({ message: "Product and specifications updated successfully!", type: "success" });
        fetchData();
      })
      .catch(err => {
        setToast({ message: "Error updating product", type: "error" });
      });
  };

  const handleUpdateReel = (e) => {
    e.preventDefault();
    fetch(`${API_BASE_URL}/api/admin/reels/${editingReel._id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(editingReel)
    })
      .then(res => res.json())
      .then(updated => {
        setReels(reels.map(r => r._id === updated._id ? updated : r));
        setEditingReel(null);
        setToast({ message: "Instagram Reel & Cover Image updated successfully!", type: "success" });
      })
      .catch(err => setToast({ message: "Error updating reel", type: "error" }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();

    fetch(`${API_BASE_URL}/api/admin/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newProduct)
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add product");
        return data;
      })
      .then(added => {
        setProducts([added, ...products]);
        setNewProduct({
          title: '',
          category: categoriesList[0] || 'Artisan Trays & Platters',
          series: seriesList[0] || 'Ellite Series',
          designNo: '',
          wholesalePrice: '',
          mrp: '',
          moq: '30 pcs',
          sku: '',
          badge: '',
          images: [''],
          specs: {
            material: '',
            finish: '',
            dimensions: '',
            weight: '',
            packaging: ''
          }
        });
        setActiveTab('products');
        setToast({ message: "New wholesale product published successfully!", type: "success" });
      })
      .catch(err => {
        setToast({ message: "Error adding product", type: "error" });
      });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Admin Header */}
        <FadeIn direction="down">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-stone-900 text-white p-8 rounded-3xl shadow-xl mb-10 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-semibold block mb-1">
                B2B TRADE DESK • ADMIN CMS ({currentUser.name} - {currentUser.role})
              </span>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
                Divine Home India Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                to="/" 
                className="bg-white/10 hover:bg-white/20 text-white text-xs uppercase px-5 py-2.5 rounded-xl font-semibold tracking-wider transition-colors border border-white/20"
              >
                View Live Website ↗
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs uppercase px-5 py-2.5 rounded-xl font-semibold tracking-wider transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Navigation Tabs */}
        <FadeIn direction="up">
          <div className="flex border-b border-stone-200 mb-8 space-x-6 text-xs uppercase tracking-widest font-semibold overflow-x-auto">
            <button 
              onClick={() => setActiveTab('products')}
              className={`pb-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'products' ? 'border-[#C5A059] text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'}`}
            >
              Manage Products ({products.length})
            </button>
            <button 
              onClick={() => setActiveTab('add-product')}
              className={`pb-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'add-product' ? 'border-[#C5A059] text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'}`}
            >
              + Add New Product
            </button>
            <button
              onClick={() => setActiveTab('reels')}
              className={`pb-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'reels' ? 'border-[#C5A059] text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'}`}
            >
              Manage Instagram Reels ({reels.length})
            </button>
            <button
              onClick={() => setActiveTab('hero-banners')}
              className={`pb-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'hero-banners' ? 'border-[#C5A059] text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'}`}
            >
              Hero Banners ({heroBanners.length})
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`pb-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'leads' ? 'border-[#C5A059] text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'}`}
            >
              Bestsellers / RFQ Leads ({nonCartLeads.length})
            </button>
            <button
              onClick={() => setActiveTab('bulk-cart')}
              className={`pb-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'bulk-cart' ? 'border-[#C5A059] text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'}`}
            >
              Bulk Cart ({bulkCartLeads.length})
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`pb-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'contacts' ? 'border-[#C5A059] text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'}`}
            >
              Contact Inquiries ({contacts.length})
            </button>
            <button
              onClick={() => setActiveTab('dealers')}
              className={`pb-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'dealers' ? 'border-[#C5A059] text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'}`}
            >
              Wholesale Dealers ({dealers.length})
            </button>
            <button
              onClick={() => setActiveTab('page-images')}
              className={`pb-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'page-images' ? 'border-[#C5A059] text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'}`}
            >
              Page Images
            </button>
            <button
              onClick={() => { setActiveTab('admins'); fetchAdmins(); }}
              className={`pb-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'admins' ? 'border-[#C5A059] text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'}`}
            >
              Manage Admins ({adminsList.length})
            </button>
          </div>
        </FadeIn>

        {/* ================= TAB 1: MANAGE PRODUCTS ================= */}
        {activeTab === 'products' && (
          <FadeIn direction="up">
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-stone-200 flex justify-between items-center">
                <h2 className="font-serif text-xl font-bold text-stone-900">Wholesale Inventory & Pricing</h2>
                <span className="text-xs text-stone-500">Karol Bagh Trade Desk Catalog</span>
              </div>

              {loading ? (
                <div className="p-12 text-center text-stone-500 font-serif">Loading catalog data...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-50 text-stone-500 uppercase text-[10px] tracking-wider border-b border-stone-200">
                        <th className="p-4">Product</th>
                        <th className="p-4">SKU / Series / Design No.</th>
                        <th className="p-4">Wholesale Price</th>
                        <th className="p-4">MRP</th>
                        <th className="p-4">MOQ</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {products.map(product => (
                        <tr key={product._id} className="hover:bg-stone-50/50 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img src={product.images[0]} alt={product.title} className="w-12 h-12 rounded-xl object-cover border border-stone-200" />
                            <div>
                              <p className="font-serif font-bold text-stone-900 line-clamp-1">{product.title}</p>
                              <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-medium">{product.badge || 'STANDARD'}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-semibold text-stone-900">{product.sku}</p>
                            <p className="text-stone-500 text-[10px]">{product.series || 'Ellite Series'} {product.designNo ? `(Des No: ${product.designNo})` : ''}</p>
                          </td>
                          <td className="p-4 font-sans font-bold text-stone-900 text-sm">₹{product.wholesalePrice}</td>
                          <td className="p-4 text-stone-400 line-through">₹{product.mrp}</td>
                          <td className="p-4 font-medium text-stone-700">{product.moq}</td>
                          <td className="p-4 text-right space-x-2">
                            <button 
                              onClick={() => openEditModal(product)}
                              className="bg-stone-900 hover:bg-[#C5A059] text-white px-3.5 py-2 rounded-xl font-semibold transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product._id)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-3.5 py-2 rounded-xl font-semibold transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </FadeIn>
        )}

        {/* ================= TAB 2: ADD NEW PRODUCT ================= */}
        {activeTab === 'add-product' && (
          <FadeIn direction="up">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm max-w-3xl mx-auto">
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6 pb-3 border-b border-stone-100">
                Add New Wholesale Product (Catalogue Master)
              </h2>

              <form onSubmit={handleAddProduct} className="space-y-5 text-xs">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-stone-700 mb-1">Product Title *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Elegant Vector 2 Pcs. Set Rec. Tray"
                    value={newProduct.title}
                    onChange={e => setNewProduct({...newProduct, title: e.target.value})}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block uppercase tracking-wider font-semibold text-stone-700">Series *</label>
                      {newProduct.series && seriesList.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: 'Remove Series',
                              message: `Are you sure you want to delete the series "${newProduct.series}"?`,
                              onConfirm: () => {
                                const updated = seriesList.filter(s => s !== newProduct.series);
                                setSeriesList(updated);
                                setNewProduct({...newProduct, series: updated[0] || ''});
                                setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
                              }
                            });
                          }}
                          className="text-[10px] bg-stone-100 hover:bg-rose-50 text-stone-500 hover:text-rose-600 px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 cursor-pointer font-medium"
                        >
                          <span>🗑️</span> Remove
                        </button>
                      )}
                    </div>
                    <select 
                      value={newProduct.series}
                      onChange={e => {
                        if (e.target.value === '+ Add New Series...') {
                          const custom = prompt("Enter new series name:");
                          if (custom && custom.trim() !== '') {
                            const trimmed = custom.trim();
                            if (!seriesList.includes(trimmed)) {
                              setSeriesList([...seriesList, trimmed]);
                            }
                            setNewProduct({...newProduct, series: trimmed});
                          }
                        } else {
                          setNewProduct({...newProduct, series: e.target.value});
                        }
                      }}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    >
                      {seriesList.map((ser, idx) => (
                        <option key={idx} value={ser}>{ser}</option>
                      ))}
                      <option value="+ Add New Series...">+ Add New Series...</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block uppercase tracking-wider font-semibold text-stone-700">Design Name *</label>
                      {newProduct.designNo && designNamesList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: 'Remove Design Name',
                              message: `Are you sure you want to delete the design name "${newProduct.designNo}"?`,
                              onConfirm: async () => {
                                const designToDelete = designNamesList.find(d => d === newProduct.designNo);
                                if (designToDelete) {
                                  try {
                                    const response = await fetch(`${API_BASE_URL}/api/design-names`, {
                                      method: 'GET',
                                      headers: getAuthHeaders()
                                    });
                                    const designs = await response.json();
                                    const designId = designs.find(d => d.name === newProduct.designNo)?._id;
                                    if (designId) {
                                      const deleteRes = await fetch(`${API_BASE_URL}/api/design-names/${designId}`, {
                                        method: 'DELETE',
                                        headers: getAuthHeaders()
                                      });
                                      if (deleteRes.ok) {
                                        const updated = designNamesList.filter(d => d !== newProduct.designNo);
                                        setDesignNamesList(updated);
                                        setNewProduct({...newProduct, designNo: updated[0] || ''});
                                        setToast({ message: 'Design name deleted', type: 'success' });
                                      }
                                    }
                                  } catch (error) {
                                    setToast({ message: 'Failed to delete design name', type: 'error' });
                                  }
                                }
                                setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
                              }
                            });
                          }}
                          className="text-[10px] bg-stone-100 hover:bg-rose-50 text-stone-500 hover:text-rose-600 px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 cursor-pointer font-medium"
                        >
                          <span>🗑️</span> Remove
                        </button>
                      )}
                    </div>
                    <select
                      required
                      value={newProduct.designNo}
                      onChange={e => {
                        if (e.target.value === '+ Add New Design Name...') {
                          const custom = prompt("Enter new design name (e.g., Peacock, Mandala, Gold Vector):");
                          if (custom && custom.trim() !== '') {
                            const trimmed = custom.trim();
                            if (!designNamesList.includes(trimmed)) {
                              fetch(`${API_BASE_URL}/api/design-names`, {
                                method: 'POST',
                                headers: getAuthHeaders(),
                                body: JSON.stringify({ name: trimmed })
                              })
                              .then(res => res.json())
                              .then(data => {
                                setDesignNamesList([...designNamesList, trimmed]);
                                setNewProduct({...newProduct, designNo: trimmed});
                                setToast({ message: 'Design name added', type: 'success' });
                              })
                              .catch(err => {
                                setToast({ message: 'Failed to add design name', type: 'error' });
                              });
                            } else {
                              setNewProduct({...newProduct, designNo: trimmed});
                            }
                          }
                        } else {
                          setNewProduct({...newProduct, designNo: e.target.value});
                        }
                      }}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    >
                      {designNamesList.map((name, idx) => (
                        <option key={idx} value={name}>{name}</option>
                      ))}
                      <option value="+ Add New Design Name...">+ Add New Design Name...</option>
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-stone-700 mb-1">SKU Code *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. DHI-TR-5001"
                      value={newProduct.sku}
                      onChange={e => setNewProduct({...newProduct, sku: e.target.value})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block uppercase tracking-wider font-semibold text-stone-700">Category *</label>
                      {newProduct.category && categoriesList.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: 'Remove Category',
                              message: `Are you sure you want to delete the category "${newProduct.category}"?`,
                              onConfirm: () => {
                                const updated = categoriesList.filter(c => c !== newProduct.category);
                                setCategoriesList(updated);
                                setNewProduct({...newProduct, category: updated[0] || ''});
                                setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
                              }
                            });
                          }}
                          className="text-[10px] bg-stone-100 hover:bg-rose-50 text-stone-500 hover:text-rose-600 px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 cursor-pointer font-medium"
                        >
                          <span>🗑️</span> Remove
                        </button>
                      )}
                    </div>
                    <select 
                      value={newProduct.category}
                      onChange={e => {
                        if (e.target.value === '+ Add New Category...') {
                          const custom = prompt("Enter new category name:");
                          if (custom && custom.trim() !== '') {
                            const trimmed = custom.trim();
                            if (!categoriesList.includes(trimmed)) {
                              setCategoriesList([...categoriesList, trimmed]);
                            }
                            setNewProduct({...newProduct, category: trimmed});
                          }
                        } else {
                          setNewProduct({...newProduct, category: e.target.value});
                        }
                      }}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    >
                      {categoriesList.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                      <option value="+ Add New Category...">+ Add New Category...</option>
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-stone-700 mb-1">Badge Tag *</label>
                    <select
                      value={newProduct.badge}
                      onChange={e => setNewProduct({...newProduct, badge: e.target.value})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="">-- Select Badge --</option>
                      <option value="NEW ARRIVAL">🆕 NEW ARRIVAL</option>
                      <option value="BESTSELLER">⭐ BESTSELLER</option>
                      <option value="LIMITED EDITION">🔥 LIMITED EDITION</option>
                      <option value="EXCLUSIVE">💎 EXCLUSIVE</option>
                      <option value="ON SALE">🎯 ON SALE</option>
                    </select>
                    <p className="text-[10px] text-stone-400 mt-1">Select a badge to display on the product card in its section on the home page</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-stone-700 mb-1">Wholesale Price (₹) *</label>
                    <input 
                      type="number" 
                      required
                      placeholder="2200"
                      value={newProduct.wholesalePrice}
                      onChange={e => setNewProduct({...newProduct, wholesalePrice: Number(e.target.value)})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-stone-700 mb-1">MRP (₹) *</label>
                    <input 
                      type="number" 
                      required
                      placeholder="3995"
                      value={newProduct.mrp}
                      onChange={e => setNewProduct({...newProduct, mrp: Number(e.target.value)})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-stone-700 mb-1">MOQ *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="30 pcs"
                      value={newProduct.moq}
                      onChange={e => setNewProduct({...newProduct, moq: e.target.value})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="pt-4 border-t border-stone-200">
                  <h4 className="font-serif text-sm font-bold text-stone-900 mb-3">Technical Specifications & Packaging</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider font-semibold text-stone-700 mb-1">Material</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Export-grade Wood & Mother of Pearl"
                        value={newProduct.specs?.material || ''}
                        onChange={e => setNewProduct({
                          ...newProduct, 
                          specs: { ...newProduct.specs, material: e.target.value }
                        })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                    <div>
                      <label className="block uppercase tracking-wider font-semibold text-stone-700 mb-1">Finish</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Hand-Polished Gold Trim Seal"
                        value={newProduct.specs?.finish || ''}
                        onChange={e => setNewProduct({
                          ...newProduct, 
                          specs: { ...newProduct.specs, finish: e.target.value }
                        })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                    <div>
                      <label className="block uppercase tracking-wider font-semibold text-stone-700 mb-1">Dimensions</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 18 x 12 inches"
                        value={newProduct.specs?.dimensions || ''}
                        onChange={e => setNewProduct({
                          ...newProduct, 
                          specs: { ...newProduct.specs, dimensions: e.target.value }
                        })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                    <div>
                      <label className="block uppercase tracking-wider font-semibold text-stone-700 mb-1">Weight</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 1.4 kg"
                        value={newProduct.specs?.weight || ''}
                        onChange={e => setNewProduct({
                          ...newProduct, 
                          specs: { ...newProduct.specs, weight: e.target.value }
                        })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block uppercase tracking-wider font-semibold text-stone-700 mb-1">Master Packaging</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 10 pcs per master carton with heavy bubble armor"
                        value={newProduct.specs?.packaging || ''}
                        onChange={e => setNewProduct({
                          ...newProduct, 
                          specs: { ...newProduct.specs, packaging: e.target.value }
                        })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>
                </div>

                {/* Cloudinary Direct Image Upload */}
                <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <label className="block uppercase tracking-wider font-semibold text-stone-700">
                    Product Images (Upload to Cloudinary or Paste URL)
                  </label>
                  
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    onChange={handleCloudinaryUpload}
                    className="w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-stone-900 file:text-white hover:file:bg-[#C5A059] file:cursor-pointer cursor-pointer"
                  />

                  {uploadingImage && (
                    <p className="text-xs text-[#C5A059] font-semibold animate-pulse">Uploading images to Cloudinary cloud...</p>
                  )}

                  <div className="mt-2">
                    <span className="text-[10px] text-stone-500 block mb-1">Or paste image URL directly:</span>
                    <input 
                      type="url" 
                      placeholder="https://res.cloudinary.com/..."
                      value={newProduct.images[0]?.startsWith('http') ? newProduct.images[0] : ''}
                      onChange={e => setNewProduct({...newProduct, images: [e.target.value]})}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  {newProduct.images.length > 0 && newProduct.images[0] !== '' && (
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {newProduct.images.map((imgSrc, idx) => (
                        <div key={idx} className="relative h-16 rounded-xl overflow-hidden border border-stone-300 bg-white shadow-sm group">
                          <img src={imgSrc} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                          <span className="absolute bottom-0.5 left-0.5 bg-stone-900/80 text-white text-[8px] px-1 py-0.2 rounded">
                            #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedImages = newProduct.images.filter((_, i) => i !== idx);
                              setNewProduct({...newProduct, images: updatedImages.length === 0 ? [''] : updatedImages});
                            }}
                            className="absolute top-1 right-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={uploadingImage}
                  className="w-full bg-stone-900 hover:bg-[#C5A059] text-white py-4 rounded-xl font-semibold uppercase tracking-widest transition-colors shadow-md cursor-pointer disabled:opacity-50"
                >
                  {uploadingImage ? 'UPLOADING IMAGES...' : 'PUBLISH PRODUCT TO CATALOG'}
                </button>
              </form>
            </div>
          </FadeIn>
        )}

        {/* ================= TAB 3: MANAGE INSTAGRAM REELS ================= */}
        {activeTab === 'reels' && (
          <FadeIn direction="up">
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden p-6 sm:p-8">
              <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">Manage Instagram Reels Showcase</h2>
              <p className="text-xs text-stone-500 mb-8">Update Instagram Reel links, video URLs, and cover/thumbnail images. All images are uploaded directly to Cloudinary for optimal performance.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {reels.map(reel => (
                  <div key={reel._id} className="flex gap-4 p-4 rounded-2xl border border-stone-200 bg-stone-50/50 items-start">
                    <img src={reel.image} alt={reel.title} className="w-20 h-28 object-cover rounded-xl shadow-sm border border-stone-200 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-stone-900 text-sm truncate mb-1">{reel.title}</h4>
                      <p className="text-[11px] text-stone-500 truncate mb-1">🔗 Instagram: {reel.url?.slice(0, 40)}...</p>
                      {reel.videoUrl && <p className="text-[11px] text-green-600 truncate mb-2">✓ Video URL set</p>}
                      <button
                        onClick={() => setEditingReel(reel)}
                        className="bg-stone-900 hover:bg-[#C5A059] text-white text-xs px-4 py-2 rounded-xl font-semibold transition-colors cursor-pointer"
                      >
                        Edit Reel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* ================= TAB 4: RFQ LEADS ================= */}
        {activeTab === 'leads' && (
          <FadeIn direction="up">
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-stone-200 flex justify-between items-center">
                <h2 className="font-serif text-xl font-bold text-stone-900">Bestseller & Bulk Enquiry Leads</h2>
                <span className="text-xs text-stone-500">Click 'View Full Details' to check email & requirements</span>
              </div>
              {nonCartLeads.length === 0 ? (
                <div className="p-12 text-center text-stone-400 font-serif">No wholesale inquiries received yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-50 text-stone-500 uppercase text-[10px] tracking-wider border-b border-stone-200">
                        <th className="p-4">Client / Company</th>
                        <th className="p-4">Contact / Phone</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Quantity Required</th>
                        <th className="p-4">Delivery City</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {nonCartLeads.map((lead, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/50">
                          <td className="p-4">
                            <p className="font-serif font-bold text-stone-900">{lead.name}</p>
                            <p className="text-[10px] text-stone-500">Company: {lead.company || 'N/A'}</p>
                          </td>
                          <td className="p-4 font-semibold text-stone-900">{lead.phone}</td>
                          <td className="p-4 text-stone-600">{lead.email || 'N/A'}</td>
                          <td className="p-4 font-bold text-[#C5A059]">{lead.quantity}</td>
                          <td className="p-4 text-stone-700">{lead.city}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="bg-stone-900 hover:bg-[#C5A059] text-white px-3.5 py-2 rounded-xl font-semibold transition-colors cursor-pointer"
                            >
                              View Full Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </FadeIn>
        )}

        {/* ================= TAB 5: BULK CART RFQS ================= */}
        {activeTab === 'bulk-cart' && (
          <FadeIn direction="up">
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-stone-200">
                <h2 className="font-serif text-xl font-bold text-stone-900">Bulk Cart Quotation Requests</h2>
                <p className="text-xs text-stone-500 mt-1">RFQs submitted from a customer's cart, including the requested product specifications.</p>
              </div>
              {bulkCartLeads.length === 0 ? (
                <div className="p-12 text-center text-stone-400 font-serif">No bulk cart quotation requests received yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-50 text-stone-500 uppercase text-[10px] tracking-wider border-b border-stone-200">
                        <th className="p-4">Client / Company</th>
                        <th className="p-4">Contact / Phone</th>
                        <th className="p-4">Cart Items</th>
                        <th className="p-4">Quantity / Total</th>
                        <th className="p-4">Delivery City</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {bulkCartLeads.map(lead => (
                        <tr key={lead._id} className="hover:bg-stone-50/50">
                          <td className="p-4">
                            <p className="font-serif font-bold text-stone-900">{lead.name}</p>
                            <p className="text-[10px] text-stone-500">{lead.company || 'N/A'}</p>
                          </td>
                          <td className="p-4 font-semibold text-stone-900">{lead.phone}</td>
                          <td className="p-4 text-stone-700">
                            {lead.cartItems?.length
                              ? lead.cartItems.map(item => item.title).join(', ')
                              : 'Product details unavailable'}
                          </td>
                          <td className="p-4">
                            <p className="font-semibold text-stone-900">{lead.quantity}</p>
                            <p className="text-[#C5A059]">{lead.totalPrice != null ? `₹${Number(lead.totalPrice).toLocaleString()}` : 'Total unavailable'}</p>
                          </td>
                          <td className="p-4 text-stone-700">{lead.city}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="bg-stone-900 hover:bg-[#C5A059] text-white px-3.5 py-2 rounded-xl font-semibold transition-colors cursor-pointer"
                            >
                              View Cart Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </FadeIn>
        )}

        {/* ================= TAB 5: CONTACT INQUIRIES ================= */}
        {activeTab === 'contacts' && (
          <FadeIn direction="up">
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-stone-200">
                <h2 className="font-serif text-xl font-bold text-stone-900">Contact Inquiries</h2>
                <p className="text-xs text-stone-500">Direct messages submitted via the website Contact page.</p>
              </div>
              {contacts.length === 0 ? (
                <div className="p-12 text-center text-stone-400 font-serif">No contact inquiries received yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-50 text-stone-500 uppercase text-[10px] tracking-wider border-b border-stone-200">
                        <th className="p-4">Sender Name</th>
                        <th className="p-4">Phone / Email</th>
                        <th className="p-4">Subject</th>
                        <th className="p-4">Message</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {contacts.map((contact, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/50">
                          <td className="p-4 font-serif font-bold text-stone-900">{contact.name}</td>
                          <td className="p-4">
                            <p className="font-semibold text-stone-900">{contact.phone}</p>
                            <p className="text-stone-500 text-[10px]">{contact.email}</p>
                          </td>
                          <td className="p-4 font-semibold text-[#C5A059]">{contact.company || 'General Inquiry'}</td>
                          <td className="p-4 text-stone-700 max-w-xs truncate">{contact.instructions}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedLead(contact)}
                              className="bg-stone-900 hover:bg-[#C5A059] text-white px-3.5 py-2 rounded-xl font-semibold transition-colors cursor-pointer"
                            >
                              View Full
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </FadeIn>
        )}

        {/* ================= TAB 6: WHOLESALE DEALERS ================= */}
        {activeTab === 'dealers' && (
          <FadeIn direction="up">
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-stone-200">
                <h2 className="font-serif text-xl font-bold text-stone-900">Wholesale Dealers Registrations</h2>
                <p className="text-xs text-stone-500">Submissions from the Wholesale / Dealers partner application form.</p>
              </div>
              {dealers.length === 0 ? (
                <div className="p-12 text-center text-stone-400 font-serif">No dealer registrations received yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-50 text-stone-500 uppercase text-[10px] tracking-wider border-b border-stone-200">
                        <th className="p-4">Firm / Company</th>
                        <th className="p-4">Contact Person</th>
                        <th className="p-4">Phone & Email</th>
                        <th className="p-4">Order Volume</th>
                        <th className="p-4">Destination City</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {dealers.map((dealer, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/50">
                          <td className="p-4 font-serif font-bold text-stone-900">{dealer.company || 'Partner Store'}</td>
                          <td className="p-4 font-semibold text-stone-900">{dealer.name}</td>
                          <td className="p-4">
                            <p className="font-semibold text-stone-900">{dealer.phone}</p>
                            <p className="text-stone-500 text-[10px]">{dealer.email}</p>
                          </td>
                          <td className="p-4 font-bold text-[#C5A059]">{dealer.quantity}</td>
                          <td className="p-4 text-stone-700">{dealer.city}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedLead(dealer)}
                              className="bg-stone-900 hover:bg-[#C5A059] text-white px-3.5 py-2 rounded-xl font-semibold transition-colors cursor-pointer"
                            >
                              View Full
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </FadeIn>
        )}

        {/* ================= TAB: HERO BANNERS ================= */}
        {activeTab === 'hero-banners' && (
          <FadeIn direction="up">
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-stone-200">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-stone-900 mb-1">Manage Hero Banners</h2>
                  <p className="text-xs text-stone-500">Update or upload homepage carousel background images (Recommended size: 1920x1080px)</p>
                </div>
              </div>

              {/* Direct Upload Box always visible */}
              <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl border-2 border-dashed border-[#C5A059] p-8 mb-8 text-center">
                <div className="space-y-3">
                  <label className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-md transition-all ${uploadingImage ? 'bg-stone-300 text-stone-500 cursor-not-allowed' : 'bg-stone-900 hover:bg-[#C5A059] text-white cursor-pointer'}`}>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingImage}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setUploadingImage(true);
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('upload_preset', 'divine_preset');

                        try {
                          const response = await fetch('https://api.cloudinary.com/v1_1/cm8nznam/image/upload', {
                            method: 'POST',
                            body: formData
                          });
                          const data = await response.json();

                          if (!response.ok) {
                            console.error('Cloudinary error response:', data);
                            setToast({ message: `Upload failed: ${data.error?.message || 'Bad request'}`, type: 'error' });
                            setUploadingImage(false);
                            return;
                          }

                          if (data.secure_url) {
                            const createRes = await fetch(`${API_BASE_URL}/api/admin/hero-banners`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                title: "Luxury Handcrafted Home Décor",
                                subtitle: "Curated collections of handcrafted brass trays and ceramics.",
                                image: data.secure_url,
                                isActive: true
                              })
                            });

                            if (createRes.ok) {
                              setToast({ message: '✓ New hero banner uploaded successfully!', type: 'success' });
                              // Force refresh hero banners
                              fetch(`${API_BASE_URL}/api/admin/hero-banners`)
                                .then(res => res.json())
                                .then(data => setHeroBanners(data))
                                .catch(err => console.error(err));
                            } else {
                              setToast({ message: 'Error saving banner to database', type: 'error' });
                            }
                          } else {
                            console.error('Cloudinary response:', data);
                            setToast({ message: `Cloudinary error: ${data.error?.message || 'Unknown error'}`, type: 'error' });
                          }
                        } catch (err) {
                          console.error('Upload error:', err);
                          setToast({ message: 'Error uploading image to cloud', type: 'error' });
                        } finally {
                          setUploadingImage(false);
                        }
                      }}
                    />
                    <Upload size={16} strokeWidth={2.5} />
                    <span>{uploadingImage ? 'UPLOADING TO CLOUD...' : '+ UPLOAD NEW HERO BANNER'}</span>
                  </label>
                  <p className="text-[11px] text-stone-500">Supports JPG, PNG, WebP format with direct Cloudinary integration.</p>
                </div>
              </div>

              {heroBanners.length === 0 ? (
                <div className="text-center py-8 bg-stone-50 rounded-2xl border border-stone-200">
                  <p className="text-stone-500 text-xs font-serif">No hero banners found in database yet. Use the upload button above to add your first slide!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {heroBanners.map((banner, bannerIndex) => (
                    <div key={banner._id} className="border border-stone-200 rounded-2xl overflow-hidden shadow-sm bg-white hover:shadow-lg transition-shadow group">
                      <div className="relative h-48 bg-stone-100 overflow-hidden">
                        <img src={banner.image} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-md font-semibold">
                          Slide #{bannerIndex + 1}
                        </span>
                      </div>
                      <div className="p-4 flex justify-between items-center bg-stone-50 border-t border-stone-200">
                        <p className="text-xs font-serif font-bold text-stone-900 truncate max-w-[200px]">{banner.title}</p>
                        <button
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: 'Delete Hero Banner',
                              message: 'Are you sure you want to delete this hero banner from the carousel?',
                              onConfirm: () => {
                                fetch(`${API_BASE_URL}/api/admin/hero-banners/${banner._id}`, {
                                  method: 'DELETE'
                                })
                                  .then(() => {
                                    setToast({ message: 'Banner deleted successfully', type: 'success' });
                                    fetchData();
                                    setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
                                  })
                                  .catch(() => {
                                    setToast({ message: 'Error deleting banner', type: 'error' });
                                    setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
                                  });
                              }
                            });
                          }}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>
        )}


        {/* ================= TAB: PAGE IMAGES MANAGER ================= */}
        {activeTab === 'page-images' && (
          <FadeIn direction="up">
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">Manage Page Static Images</h2>
              <p className="text-xs text-stone-500 mb-8">Update all static images used across different pages (About, Collections, Contact, Home)</p>

              <div className="space-y-8">
                {/* About Page Images */}
                <div className="border-b border-stone-200 pb-8">
                  <h3 className="font-serif text-lg font-bold text-stone-900 mb-4">📄 About Page</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Hero Background Image */}
                    <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700">Hero Background Image</label>
                      {pageImages.about_hero && (
                        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-stone-200">
                          <img src={pageImages.about_hero} alt="About Hero" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingKeys.about_hero}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadingKeys({...uploadingKeys, about_hero: true});
                            const formData = new FormData();
                            formData.append('file', file);
                            formData.append('upload_preset', 'divine_preset');

                            fetch('https://api.cloudinary.com/v1_1/cm8nznam/image/upload', {
                              method: 'POST',
                              body: formData
                            })
                              .then(res => res.json())
                              .then(data => {
                                setPageImages({...pageImages, about_hero: data.secure_url});
                                setUploadingKeys({...uploadingKeys, about_hero: false});
                                setToast({ message: 'Image uploaded!', type: 'success' });
                              })
                              .catch(err => {
                                console.error(err);
                                setUploadingKeys({...uploadingKeys, about_hero: false});
                                setToast({ message: 'Upload failed', type: 'error' });
                              });
                          }
                        }}
                        className="w-full text-xs cursor-pointer bg-white border border-stone-300 rounded-lg px-2 py-2"
                      />
                      <button
                        onClick={() => {
                          fetch(`${API_BASE_URL}/api/admin/page-images`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ key: 'about_hero', url: pageImages.about_hero })
                          })
                            .then(() => setToast({ message: 'Image saved!', type: 'success' }))
                            .catch(() => {
                              console.log('Saved to localStorage');
                              setToast({ message: 'Image saved locally!', type: 'success' });
                            });
                        }}
                        disabled={uploadingKeys.about_hero}
                        className="bg-stone-900 hover:bg-[#C5A059] disabled:bg-stone-400 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer w-full"
                      >
                        {uploadingKeys.about_hero ? 'Uploading...' : 'Save to Backend'}
                      </button>
                    </div>

                    {/* About Section Image 1 */}
                    <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700">About Section Image 1</label>
                      {pageImages.about_img1 && (
                        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-stone-200">
                          <img src={pageImages.about_img1} alt="About Image 1" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingKeys.about_img1}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadingKeys({...uploadingKeys, about_img1: true});
                            const formData = new FormData();
                            formData.append('file', file);
                            formData.append('upload_preset', 'divine_preset');

                            fetch('https://api.cloudinary.com/v1_1/cm8nznam/image/upload', {
                              method: 'POST',
                              body: formData
                            })
                              .then(res => res.json())
                              .then(data => {
                                setPageImages({...pageImages, about_img1: data.secure_url});
                                setUploadingKeys({...uploadingKeys, about_img1: false});
                                setToast({ message: 'Image uploaded!', type: 'success' });
                              })
                              .catch(err => {
                                console.error(err);
                                setUploadingKeys({...uploadingKeys, about_img1: false});
                                setToast({ message: 'Upload failed', type: 'error' });
                              });
                          }
                        }}
                        className="w-full text-xs cursor-pointer bg-white border border-stone-300 rounded-lg px-2 py-2"
                      />
                      <button
                        onClick={() => {
                          fetch(`${API_BASE_URL}/api/admin/page-images`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ key: 'about_img1', url: pageImages.about_img1 })
                          })
                            .then(() => setToast({ message: 'Image saved!', type: 'success' }))
                            .catch(() => {
                              console.log('Saved to localStorage');
                              setToast({ message: 'Image saved locally!', type: 'success' });
                            });
                        }}
                        disabled={uploadingKeys.about_img1}
                        className="bg-stone-900 hover:bg-[#C5A059] disabled:bg-stone-400 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer w-full"
                      >
                        {uploadingKeys.about_img1 ? 'Uploading...' : 'Save to Backend'}
                      </button>
                    </div>

                    {/* About Section Image 2 */}
                    <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700">About Section Image 2</label>
                      {pageImages.about_img2 && (
                        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-stone-200">
                          <img src={pageImages.about_img2} alt="About Image 2" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingKeys.about_img2}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadingKeys({...uploadingKeys, about_img2: true});
                            const formData = new FormData();
                            formData.append('file', file);
                            formData.append('upload_preset', 'divine_preset');

                            fetch('https://api.cloudinary.com/v1_1/cm8nznam/image/upload', {
                              method: 'POST',
                              body: formData
                            })
                              .then(res => res.json())
                              .then(data => {
                                setPageImages({...pageImages, about_img2: data.secure_url});
                                setUploadingKeys({...uploadingKeys, about_img2: false});
                                setToast({ message: 'Image uploaded!', type: 'success' });
                              })
                              .catch(err => {
                                console.error(err);
                                setUploadingKeys({...uploadingKeys, about_img2: false});
                                setToast({ message: 'Upload failed', type: 'error' });
                              });
                          }
                        }}
                        className="w-full text-xs cursor-pointer bg-white border border-stone-300 rounded-lg px-2 py-2"
                      />
                      <button
                        onClick={() => {
                          fetch(`${API_BASE_URL}/api/admin/page-images`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ key: 'about_img2', url: pageImages.about_img2 })
                          })
                            .then(() => setToast({ message: 'Image saved!', type: 'success' }))
                            .catch(() => {
                              console.log('Saved to localStorage');
                              setToast({ message: 'Image saved locally!', type: 'success' });
                            });
                        }}
                        disabled={uploadingKeys.about_img2}
                        className="bg-stone-900 hover:bg-[#C5A059] disabled:bg-stone-400 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer w-full"
                      >
                        {uploadingKeys.about_img2 ? 'Uploading...' : 'Save to Backend'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Home Page Images */}
                <div className="border-b border-stone-200 pb-8">
                  <h3 className="font-serif text-lg font-bold text-stone-900 mb-4">🏠 Home Page</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700">Brand Story Section Image</label>
                      {pageImages.home_story && (
                        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-stone-200">
                          <img src={pageImages.home_story} alt="Home Story" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingKeys.home_story}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadingKeys({...uploadingKeys, home_story: true});
                            const formData = new FormData();
                            formData.append('file', file);
                            formData.append('upload_preset', 'divine_preset');

                            fetch('https://api.cloudinary.com/v1_1/cm8nznam/image/upload', {
                              method: 'POST',
                              body: formData
                            })
                              .then(res => res.json())
                              .then(data => {
                                setPageImages({...pageImages, home_story: data.secure_url});
                                setUploadingKeys({...uploadingKeys, home_story: false});
                                setToast({ message: 'Image uploaded!', type: 'success' });
                              })
                              .catch(err => {
                                console.error(err);
                                setUploadingKeys({...uploadingKeys, home_story: false});
                                setToast({ message: 'Upload failed', type: 'error' });
                              });
                          }
                        }}
                        className="w-full text-xs cursor-pointer bg-white border border-stone-300 rounded-lg px-2 py-2"
                      />
                      <button
                        onClick={() => {
                          fetch(`${API_BASE_URL}/api/admin/page-images`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ key: 'home_story', url: pageImages.home_story })
                          })
                            .then(() => setToast({ message: 'Image saved!', type: 'success' }))
                            .catch(() => {
                              console.log('Saved to localStorage');
                              setToast({ message: 'Image saved locally!', type: 'success' });
                            });
                        }}
                        disabled={uploadingKeys.home_story}
                        className="bg-stone-900 hover:bg-[#C5A059] disabled:bg-stone-400 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer w-full"
                      >
                        {uploadingKeys.home_story ? 'Uploading...' : 'Save to Backend'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Collections Page Images */}
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 mb-4">📚 Collections Page</h3>
                  <p className="text-xs text-stone-500 mb-4">Category Banner Images (Uploaded to Cloudinary)</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { key: 'collections_artisan', label: 'Artisan Trays & Platters' },
                      { key: 'collections_trays', label: 'Trays & Serving Platters' },
                      { key: 'collections_organizers', label: 'Organizers & Holders' },
                      { key: 'collections_tableware', label: 'Tableware & Dining' },
                      { key: 'collections_crockery', label: 'Crockery' }
                    ].map((item) => (
                      <div key={item.key} className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                        <label className="text-xs font-semibold text-stone-700 block">{item.label}</label>

                        {pageImages[item.key] && (
                          <div className="relative w-full h-32 rounded-lg overflow-hidden bg-stone-200">
                            <img src={pageImages[item.key]} alt={item.label} className="w-full h-full object-cover" />
                          </div>
                        )}

                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingKeys[item.key]}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setUploadingKeys({...uploadingKeys, [item.key]: true});
                              const formData = new FormData();
                              formData.append('file', file);
                              formData.append('upload_preset', 'divine_preset');

                              fetch('https://api.cloudinary.com/v1_1/cm8nznam/image/upload', {
                                method: 'POST',
                                body: formData
                              })
                                .then(res => res.json())
                                .then(data => {
                                  setPageImages({...pageImages, [item.key]: data.secure_url});
                                  setUploadingKeys({...uploadingKeys, [item.key]: false});
                                  setToast({ message: 'Image uploaded to Cloudinary!', type: 'success' });
                                })
                                .catch(err => {
                                  console.error(err);
                                  setUploadingKeys({...uploadingKeys, [item.key]: false});
                                  setToast({ message: 'Upload failed', type: 'error' });
                                });
                            }
                          }}
                          className="w-full text-xs cursor-pointer bg-white border border-stone-300 rounded-lg px-2 py-2"
                        />

                        <button
                          onClick={() => {
                            // POST to backend to save image
                            fetch(`${API_BASE_URL}/api/admin/page-images`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                key: item.key,
                                url: pageImages[item.key]
                              })
                            })
                              .then(res => res.json())
                              .then(data => {
                                console.log('✅ Saved to backend:', data);
                                setToast({ message: `${item.label} image saved to backend!`, type: 'success' });
                              })
                              .catch(err => {
                                console.error('❌ Backend save failed:', err);
                                setToast({ message: 'Error saving to backend', type: 'error' });
                              });
                          }}
                          disabled={uploadingKeys[item.key]}
                          className="bg-stone-900 hover:bg-[#C5A059] disabled:bg-stone-400 text-white px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer w-full transition-colors"
                        >
                          {uploadingKeys[item.key] ? 'Uploading...' : 'Save to Backend'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* ================= TAB 7: MANAGE ADMINS ================= */}
        {activeTab === 'admins' && (
          <FadeIn direction="up">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm h-fit">
                <h3 className="font-serif text-lg font-bold text-stone-900 mb-4">Create New Admin Account</h3>
                <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Rahul Sharma" 
                      value={newAdmin.name} 
                      onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} 
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900" 
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="rahul@divinehomeindia.com" 
                      value={newAdmin.email} 
                      onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} 
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900" 
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Password</label>
                    <input 
                      type="password" 
                      required 
                      placeholder="••••••••" 
                      value={newAdmin.password} 
                      onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} 
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900" 
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Role Privileges</label>
                    <select 
                      value={newAdmin.role} 
                      onChange={e => setNewAdmin({...newAdmin, role: e.target.value})} 
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900"
                    >
                      <option value="admin">Standard Admin</option>
                      <option value="super-admin">Super Admin</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-stone-900 hover:bg-[#C5A059] text-white py-3.5 rounded-xl font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Create Admin Account
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden p-6 sm:p-8">
                <h3 className="font-serif text-lg font-bold text-stone-900 mb-4">Authorized Trade Desk Admins</h3>
                <div className="space-y-3">
                  {adminsList.map(adm => (
                    <div key={adm._id} className="flex justify-between items-center p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
                      <div>
                        <p className="font-serif font-bold text-stone-900 text-sm">{adm.name}</p>
                        <p className="text-[11px] text-stone-500">{adm.email}</p>
                      </div>
                      <div>
                        <span className={`text-[10px] px-3 py-1 rounded-md uppercase font-bold ${adm.role === 'super-admin' ? 'bg-amber-100 text-amber-800' : 'bg-stone-200 text-stone-800'}`}>
                          {adm.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* ================= CUSTOM STYLISH CONFIRMATION MODAL ================= */}
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#FDFBF7] w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 relative text-center space-y-4">
              <div className="w-12 h-12 bg-amber-100 text-[#C5A059] rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                ⚠️
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                {confirmModal.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                {confirmModal.message}
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })}
                  className="bg-stone-200 hover:bg-stone-300 text-stone-800 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmModal.onConfirm}
                  className="bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                >
                  Yes, Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= LEAD FULL DETAILS MODAL ================= */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#FDFBF7] w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                Enquiry / Registration Full Details
              </h3>
              <div className="space-y-3 text-xs text-stone-700">
                <p><strong>Client Name:</strong> {selectedLead.name}</p>
                <p><strong>Company Name:</strong> {selectedLead.company || 'N/A'}</p>
                <p><strong>Phone / WhatsApp:</strong> {selectedLead.phone}</p>
                <p><strong>Business Email:</strong> {selectedLead.email || 'N/A'}</p>
                <p><strong>Quantity / Volume:</strong> <span className="text-[#C5A059] font-bold">{selectedLead.quantity}</span></p>
                <p><strong>Delivery City / Pincode:</strong> {selectedLead.city}</p>
                {selectedLead.cartItems?.length > 0 && (
                  <div className="pt-2 border-t border-stone-200">
                    <strong className="block mb-2 text-stone-900 uppercase text-[10px] tracking-wider">Cart Products & Specifications:</strong>
                    <div className="space-y-2">
                      {selectedLead.cartItems.map((item, index) => (
                        <div key={`${item.productId || item.sku || item.title}-${index}`} className="bg-white p-3 rounded-xl border border-stone-200">
                          <p className="font-semibold text-stone-900">{item.title} — Qty: {item.quantity}</p>
                          <p className="text-stone-600">Design: {item.designNo || 'N/A'} · SKU: {item.sku || 'N/A'} · Category: {item.category || 'N/A'}</p>
                          <p className="text-stone-600">Series: {item.series || 'N/A'} · Material: {item.material || 'N/A'} · Finish: {item.finish || 'N/A'}</p>
                          <p className="text-stone-600">Dimensions: {item.dimensions || 'N/A'} · MOQ: {item.moq || 'N/A'}</p>
                          <p className="text-stone-600">Unit price: ₹{Number(item.wholesalePrice || 0).toLocaleString()}</p>
                        </div>
                      ))}
                      {selectedLead.totalPrice != null && (
                        <p className="text-right font-bold text-[#C5A059]">Cart total: ₹{Number(selectedLead.totalPrice).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                )}
                <div className="pt-2 border-t border-stone-200">
                  <strong className="block mb-1 text-stone-900 uppercase text-[10px] tracking-wider">Message / Special Instructions:</strong>
                  <p className="bg-white p-3 rounded-xl border border-stone-200 text-stone-800 italic leading-relaxed">
                    {selectedLead.instructions || 'No notes provided.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <a 
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${selectedLead.name},%20regarding%20your%20inquiry%20at%20Divine%20Home%20India:`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider"
                >
                  💬 Chat on WhatsApp
                </a>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= EDIT PRODUCT MODAL ================= */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#FDFBF7] w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-4">Edit Wholesale Product & Catalog Specs</h3>
              <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-2">
                <div>
                  <label className="block uppercase font-semibold text-stone-700 mb-1">Product Title</label>
                  <input 
                    type="text" 
                    value={editingProduct.title || ''}
                    onChange={e => setEditingProduct({...editingProduct, title: e.target.value})}
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase font-semibold text-stone-700 mb-1">Series Name</label>
                    <select 
                      value={editingProduct.series || seriesList[0]}
                      onChange={e => setEditingProduct({...editingProduct, series: e.target.value})}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-900"
                    >
                      {seriesList.map((ser, idx) => (
                        <option key={idx} value={ser}>{ser}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase font-semibold text-stone-700 mb-1">Category</label>
                    <select 
                      value={editingProduct.category || categoriesList[0]}
                      onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-900"
                    >
                      {categoriesList.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block uppercase font-semibold text-stone-700 mb-1">Design No.</label>
                    <input 
                      type="text" 
                      value={editingProduct.designNo || ''}
                      onChange={e => setEditingProduct({...editingProduct, designNo: e.target.value})}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block uppercase font-semibold text-stone-700 mb-1">Wholesale Price (₹)</label>
                    <input 
                      type="number" 
                      value={editingProduct.wholesalePrice || ''}
                      onChange={e => setEditingProduct({...editingProduct, wholesalePrice: Number(e.target.value)})}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block uppercase font-semibold text-stone-700 mb-1">MRP (₹)</label>
                    <input 
                      type="number" 
                      value={editingProduct.mrp || ''}
                      onChange={e => setEditingProduct({...editingProduct, mrp: Number(e.target.value)})}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-900"
                    />
                  </div>
                </div>

                {/* Edit Modal Cloudinary Image Upload */}
                <div className="space-y-2 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                  <label className="block uppercase font-semibold text-stone-700">Update Product Images (Cloudinary)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    onChange={handleEditCloudinaryUpload}
                    className="w-full text-xs text-stone-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-stone-900 file:text-white cursor-pointer"
                  />
                  {uploadingImage && (
                    <p className="text-[10px] text-[#C5A059] font-semibold animate-pulse">Uploading to cloud...</p>
                  )}
                  {editingProduct.images && editingProduct.images[0] && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {editingProduct.images.map((img, i) => (
                        <div key={i} className="relative group">
                          <img src={img} alt="Thumb" className="w-12 h-12 object-cover rounded-lg border border-stone-300" />
                          <button
                            type="button"
                            onClick={() => {
                              const updatedImages = editingProduct.images.filter((_, idx) => idx !== i);
                              setEditingProduct({...editingProduct, images: updatedImages.length === 0 ? [''] : updatedImages});
                            }}
                            className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-200">
                  <h4 className="font-serif text-xs font-bold text-stone-900 mb-2">Technical Specifications</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-stone-600 mb-1">Material</label>
                      <input 
                        type="text" 
                        value={editingProduct.specs?.material || ''}
                        onChange={e => setEditingProduct({
                          ...editingProduct, 
                          specs: { ...editingProduct.specs, material: e.target.value }
                        })}
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-stone-600 mb-1">Finish</label>
                      <input 
                        type="text" 
                        value={editingProduct.specs?.finish || ''}
                        onChange={e => setEditingProduct({
                          ...editingProduct, 
                          specs: { ...editingProduct.specs, finish: e.target.value }
                        })}
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-stone-600 mb-1">Dimensions</label>
                      <input 
                        type="text" 
                        value={editingProduct.specs?.dimensions || ''}
                        onChange={e => setEditingProduct({
                          ...editingProduct, 
                          specs: { ...editingProduct.specs, dimensions: e.target.value }
                        })}
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-stone-600 mb-1">Weight</label>
                      <input 
                        type="text" 
                        value={editingProduct.specs?.weight || ''}
                        onChange={e => setEditingProduct({
                          ...editingProduct, 
                          specs: { ...editingProduct.specs, weight: e.target.value }
                        })}
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-stone-600 mb-1">Master Packaging</label>
                      <input 
                        type="text" 
                        value={editingProduct.specs?.packaging || ''}
                        onChange={e => setEditingProduct({
                          ...editingProduct, 
                          specs: { ...editingProduct.specs, packaging: e.target.value }
                        })}
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-stone-200">
                  <button type="submit" className="flex-1 bg-stone-900 hover:bg-[#C5A059] text-white py-3.5 rounded-xl font-semibold uppercase tracking-wider cursor-pointer">Save Changes</button>
                  <button type="button" onClick={() => setEditingProduct(null)} className="px-6 bg-stone-200 text-stone-800 py-3.5 rounded-xl font-semibold cursor-pointer">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= EDIT INSTAGRAM REEL MODAL ================= */}
        {editingReel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#FDFBF7] w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-4">Edit Instagram Reel & Cover</h3>

              <form onSubmit={handleUpdateReel} className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Reel Title</label>
                  <input
                    type="text"
                    value={editingReel.title || ''}
                    onChange={e => setEditingReel({...editingReel, title: e.target.value})}
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Instagram Reel Link (URL)</label>
                  <input
                    type="url"
                    required
                    value={editingReel.url || ''}
                    onChange={e => setEditingReel({...editingReel, url: e.target.value})}
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Video URL (MP4)</label>
                  <p className="text-[10px] text-stone-500 mb-2">Upload MP4 video to Cloudinary and paste URL here for autoplay</p>
                  <input
                    type="url"
                    value={editingReel.videoUrl || ''}
                    onChange={e => setEditingReel({...editingReel, url: e.target.value})}
                    placeholder="https://res.cloudinary.com/.../video.mp4"
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-900 text-[11px]"
                  />
                </div>

                {/* Cloudinary Cover Image Upload */}
                <div className="space-y-2 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                  <label className="block font-semibold text-stone-700">Upload Cover Image (Cloudinary)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditCloudinaryUpload}
                    className="w-full text-xs text-stone-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-stone-900 file:text-white hover:file:bg-[#C5A059] file:cursor-pointer cursor-pointer"
                  />
                  {uploadingImage && (
                    <p className="text-[10px] text-[#C5A059] font-semibold animate-pulse">Uploading to Cloudinary...</p>
                  )}
                  {editingReel.image && (
                    <img src={editingReel.image} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-stone-300 mt-2" />
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-stone-200">
                  <button
                    type="submit"
                    disabled={uploadingImage}
                    className="flex-1 bg-stone-900 hover:bg-[#C5A059] text-white py-3.5 rounded-xl font-semibold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Update Reel
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingReel(null)}
                    className="px-6 bg-stone-200 hover:bg-stone-300 text-stone-800 py-3.5 rounded-xl font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

AdminDashboard.displayName = 'AdminDashboard';
export default AdminDashboard;