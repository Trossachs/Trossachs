import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { HeroCarouselEditor } from "@/components/admin/HeroCarouselEditor";
import { PageContentEditor } from "@/components/admin/PageContentEditor";
// Define site settings interface
type SiteSettings = {
  logo: {
    text: string;
    imageUrl?: string;
  };
  footer: {
    companyName: string;
    address: string;
    phone: string;
    email: string;
    socialLinks: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
    copyright: string;
  };
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Fetch products
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  // Fetch site settings
  const { data: settingsData, isLoading: settingsLoading } = useQuery({
    queryKey: ["/api/admin/settings"],
  });

  useEffect(() => {
    if (settingsData?.settings) {
      setSiteSettings(settingsData.settings);
    }
  }, [settingsData]);

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async (data: { id: number; product: any }) => {
      return apiRequest("PATCH", `/api/admin/products/${data.id}`, data.product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product updated",
        description: "The product has been updated successfully",
      });
    },
  });

  // Update site settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<SiteSettings>) => {
      return apiRequest("PATCH", "/api/admin/settings", settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: "Settings updated",
        description: "The site settings have been updated successfully",
      });
    },
  });

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSelectedProduct((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct) {
      updateProductMutation.mutate({
        id: selectedProduct.id,
        product: selectedProduct,
      });
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSiteSettings((prev) => prev ? {
      ...prev,
      logo: {
        ...prev.logo,
        [name]: value
      }
    } : null);
  };

  const handleFooterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("social_")) {
      const socialType = name.replace("social_", "");
      setSiteSettings((prev) => prev ? {
        ...prev,
        footer: {
          ...prev.footer,
          socialLinks: {
            ...prev.footer.socialLinks,
            [socialType]: value
          }
        }
      } : null);
    } else {
      setSiteSettings((prev) => prev ? {
        ...prev,
        footer: {
          ...prev.footer,
          [name]: value
        }
      } : null);
    }
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (siteSettings) {
      updateSettingsMutation.mutate(siteSettings);
    }
  };

  const products = productsData?.products || [];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 mb-8">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="carousel">Hero Carousel</TabsTrigger>
          <TabsTrigger value="about">About Page</TabsTrigger>
          <TabsTrigger value="contact">Contact Page</TabsTrigger>
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Product List</CardTitle>
                <CardDescription>Select a product to edit</CardDescription>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <p>Loading products...</p>
                ) : (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {products.map((product: any) => (
                      <div
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className={`p-3 rounded cursor-pointer ${
                          selectedProduct?.id === product.id
                            ? "bg-primary/20"
                            : "hover:bg-neutral-100"
                        }`}
                      >
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-neutral-500">
                          {product.category} - ₦{product.price}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Edit Product</CardTitle>
                <CardDescription>
                  Update product information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedProduct ? (
                  <p>Select a product from the list to edit</p>
                ) : (
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={selectedProduct.name}
                        onChange={handleProductChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={selectedProduct.description}
                        onChange={handleProductChange}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (₦)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={selectedProduct.price}
                          onChange={handleProductChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="oldPrice">Old Price (₦, optional)</Label>
                        <Input
                          id="oldPrice"
                          name="oldPrice"
                          type="number"
                          value={selectedProduct.oldPrice || ""}
                          onChange={handleProductChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        name="imageUrl"
                        value={selectedProduct.imageUrl}
                        onChange={handleProductChange}
                      />
                      {selectedProduct.imageUrl && (
                        <div className="mt-2">
                          <img
                            src={selectedProduct.imageUrl}
                            alt={selectedProduct.name}
                            className="w-40 h-40 object-cover rounded border"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          name="category"
                          value={selectedProduct.category}
                          onChange={handleProductChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subCategory">Subcategory</Label>
                        <Input
                          id="subCategory"
                          name="subCategory"
                          value={selectedProduct.subCategory || ""}
                          onChange={handleProductChange}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="mt-4"
                      disabled={updateProductMutation.isPending}
                    >
                      {updateProductMutation.isPending
                        ? "Saving..."
                        : "Save Changes"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Hero Carousel Tab */}
        <TabsContent value="carousel">
          <HeroCarouselEditor />
        </TabsContent>
        
        {/* About Page Tab */}
        <TabsContent value="about">
          <PageContentEditor pageType="about" />
        </TabsContent>
        
        {/* Contact Page Tab */}
        <TabsContent value="contact">
          <PageContentEditor pageType="contact" />
        </TabsContent>

        {/* Logo Tab */}
        <TabsContent value="logo">
          <Card>
            <CardHeader>
              <CardTitle>Logo Settings</CardTitle>
              <CardDescription>Update your site logo</CardDescription>
            </CardHeader>
            <CardContent>
              {settingsLoading ? (
                <p>Loading logo settings...</p>
              ) : (
                <form onSubmit={handleSettingsSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logoText">Logo Text</Label>
                    <Input
                      id="logoText"
                      name="text"
                      value={siteSettings?.logo.text || ""}
                      onChange={handleLogoChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logoImage">Logo Image URL (optional)</Label>
                    <Input
                      id="logoImage"
                      name="imageUrl"
                      value={siteSettings?.logo.imageUrl || ""}
                      onChange={handleLogoChange}
                    />
                    {siteSettings?.logo.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={siteSettings.logo.imageUrl}
                          alt="Logo preview"
                          className="h-16 object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="mt-4"
                    disabled={updateSettingsMutation.isPending}
                  >
                    {updateSettingsMutation.isPending
                      ? "Saving..."
                      : "Save Logo Settings"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer Tab */}
        <TabsContent value="footer">
          <Card>
            <CardHeader>
              <CardTitle>Footer Settings</CardTitle>
              <CardDescription>
                Update footer information and links
              </CardDescription>
            </CardHeader>
            <CardContent>
              {settingsLoading ? (
                <p>Loading footer settings...</p>
              ) : (
                <form onSubmit={handleSettingsSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={siteSettings?.footer.companyName || ""}
                      onChange={handleFooterChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={siteSettings?.footer.address || ""}
                      onChange={handleFooterChange}
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={siteSettings?.footer.phone || ""}
                        onChange={handleFooterChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        value={siteSettings?.footer.email || ""}
                        onChange={handleFooterChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="copyright">Copyright Text</Label>
                    <Input
                      id="copyright"
                      name="copyright"
                      value={siteSettings?.footer.copyright || ""}
                      onChange={handleFooterChange}
                    />
                  </div>

                  <h3 className="text-lg font-medium pt-2">Social Links</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        name="social_facebook"
                        value={siteSettings?.footer.socialLinks.facebook || ""}
                        onChange={handleFooterChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        name="social_twitter"
                        value={siteSettings?.footer.socialLinks.twitter || ""}
                        onChange={handleFooterChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        name="social_instagram"
                        value={siteSettings?.footer.socialLinks.instagram || ""}
                        onChange={handleFooterChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        name="social_linkedin"
                        value={siteSettings?.footer.socialLinks.linkedin || ""}
                        onChange={handleFooterChange}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="mt-4"
                    disabled={updateSettingsMutation.isPending}
                  >
                    {updateSettingsMutation.isPending
                      ? "Saving..."
                      : "Save Footer Settings"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;