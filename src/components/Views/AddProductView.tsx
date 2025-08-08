import React, { useState } from 'react';
import { Upload, X, Camera } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { ProductCategory } from '../../types';
import { getCategoryLabel } from '../../utils/formatters';

const AddProductView: React.FC = () => {
  const { createProduct } = useProducts();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '' as ProductCategory | '',
    condition: 'new' as 'new' | 'used',
    location: '',
    images: [] as string[]
  });

  const [dragOver, setDragOver] = useState(false);

  const categories: ProductCategory[] = ['electronics', 'clothing', 'vehicles', 'furniture', 'services'];
  const locations = ['Conakry', 'Kankan', 'Labé', 'Kindia', 'Boké', 'Faranah', 'Mamou', 'N\'Zérékoré'];

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    // Simulate image upload - in real app, you'd upload to a server
    const mockImageUrls = [
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
      'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg',
      'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg'
    ];
    
    const newImages = Array.from(files).map((_, index) => 
      mockImageUrls[index % mockImageUrls.length]
    );
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 5) // Max 5 images
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreateProduct();
  };

  const handleCreateProduct = async () => {
    if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.location) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      await createProduct({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        images: formData.images.length > 0 ? formData.images : ['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'],
        category: formData.category as ProductCategory,
        condition: formData.condition,
        location: formData.location
      });

      alert('Annonce publiée avec succès! Elle sera vérifiée par notre équipe avant d\'être mise en ligne.');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: 'new',
        location: '',
        images: []
      });
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la publication de l\'annonce');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Publier une annonce</h1>
        <p className="text-gray-600">Remplissez les informations ci-dessous pour publier votre produit</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos du produit</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                <img src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            {formData.images.length < 5 && (
              <div
                className={`
                  aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors
                  ${dragOver ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-red-400 hover:bg-red-50'}
                `}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleImageUpload(e.dataTransfer.files);
                }}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.accept = 'image/*';
                  input.onchange = (e) => handleImageUpload((e.target as HTMLInputElement).files);
                  input.click();
                }}
              >
                <Camera className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500 text-center">Ajouter photo</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-500">
            Ajoutez jusqu'à 5 photos. La première photo sera utilisée comme image principale.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de base</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre de l'annonce *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: iPhone 14 Pro Max en excellent état"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrivez votre produit en détail..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prix (GNF) *</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="Ex: 850000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Category and Details */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Catégorie et détails</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ProductCategory }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {getCategoryLabel(category)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">État *</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="condition"
                      value="new"
                      checked={formData.condition === 'new'}
                      onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value as 'new' | 'used' }))}
                      className="mr-2 text-red-600"
                    />
                    <span>Neuf</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="condition"
                      value="used"
                      checked={formData.condition === 'used'}
                      onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value as 'new' | 'used' }))}
                      className="mr-2 text-red-600"
                    />
                    <span>Occasion</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Localisation *</label>
                <select
                  required
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une ville</option>
                  {locations.map(location => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading || !formData.title || !formData.description || !formData.price || !formData.category || !formData.location}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Publication...' : 'Publier l\'annonce'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductView;