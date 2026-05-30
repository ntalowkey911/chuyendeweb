"use client";

import { UserProfile } from "@clerk/nextjs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import ProtectedRoute from "@/components/ProtectedRoute";
import OrdersTab from "@/components/profile/OrdersTab";
import WishlistTab from "@/components/profile/WishlistTab";
import AddressTab from "@/components/profile/AddressTab";

// SVG icons for tabs
const ShoppingBagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        
        <main className="flex-1 py-8 md:py-12">
          <Container className="flex justify-center">
            {/* 
              We use Clerk's UserProfile to handle the main UI. 
              We inject custom tabs for Orders, Wishlist, and Address. 
            */}
            <UserProfile path="/profile" routing="path">
              <UserProfile.Page
                label="Đơn hàng"
                labelIcon={<ShoppingBagIcon />}
                url="orders"
              >
                <OrdersTab />
              </UserProfile.Page>

              <UserProfile.Page
                label="Yêu thích"
                labelIcon={<HeartIcon />}
                url="wishlist"
              >
                <WishlistTab />
              </UserProfile.Page>

              <UserProfile.Page
                label="Địa chỉ"
                labelIcon={<MapPinIcon />}
                url="address"
              >
                <AddressTab />
              </UserProfile.Page>
            </UserProfile>
          </Container>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
