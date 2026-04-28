/**
 * KrushiSetu — Database Seeder
 * Run: node seed.js
 * Creates demo admin, farmer, trader accounts + sample crops
 */

require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/User.model')
const Farmer = require('./models/Farmer.model')
const Trader = require('./models/Trader.model')
const Crop = require('./models/Crop.model')

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Farmer.deleteMany({}),
      Trader.deleteMany({}),
      Crop.deleteMany({}),
    ])
    console.log('🗑️  Cleared existing data')

    // --- Create Users ---
    const adminUser = await User.create({
      fullName: 'Admin KrushiSetu',
      email: 'admin@demo.com',
      password: 'demo1234',
      role: 'admin',
      phone: '9000000000',
    })

    const farmerUser = await User.create({
      fullName: 'Ramesh Patil',
      email: 'farmer@demo.com',
      password: 'demo1234',
      role: 'farmer',
      phone: '9111111111',
    })

    const farmerUser2 = await User.create({
      fullName: 'Sunita Jadhav',
      email: 'farmer2@demo.com',
      password: 'demo1234',
      role: 'farmer',
      phone: '9222222222',
    })

    const traderUser = await User.create({
      fullName: 'Arun Mehta',
      email: 'trader@demo.com',
      password: 'demo1234',
      role: 'trader',
      phone: '9333333333',
    })

    const traderUser2 = await User.create({
      fullName: 'Priya Sharma',
      email: 'trader2@demo.com',
      password: 'demo1234',
      role: 'trader',
      phone: '9444444444',
    })

    // --- Farmer Profiles ---
    await Farmer.create({
      userId: farmerUser._id,
      farmLocation: 'Nashik, Maharashtra',
      farmSize: '12 acres',
      cropsGrown: ['tomatoes', 'onions', 'grapes'],
      rating: 4.5,
      totalRatings: 12,
      bio: 'Third generation farmer from Nashik specialising in tomatoes and grapes.',
    })

    await Farmer.create({
      userId: farmerUser2._id,
      farmLocation: 'Pune, Maharashtra',
      farmSize: '8 acres',
      cropsGrown: ['wheat', 'soybeans', 'sugarcane'],
      rating: 4.2,
      totalRatings: 8,
      bio: 'Organic farmer focused on sustainable farming practices.',
    })

    // --- Trader Profiles ---
    await Trader.create({
      userId: traderUser._id,
      companyName: 'Mehta Agro Traders',
      businessLicense: 'MAH-AGR-2024-001',
      location: 'Mumbai, Maharashtra',
      rating: 4.7,
      totalRatings: 25,
    })

    await Trader.create({
      userId: traderUser2._id,
      companyName: 'Sharma Fresh Exports',
      businessLicense: 'MAH-EXP-2024-002',
      location: 'Nagpur, Maharashtra',
      rating: 4.3,
      totalRatings: 15,
    })

    // --- Crops ---
    const crops = [
      {
        farmerId: farmerUser._id,
        cropName: 'Fresh Tomatoes',
        category: 'vegetables',
        quantity: 500,
        pricePerKg: 25,
        sellingType: 'fixed',
        location: 'Nashik, Maharashtra',
        description: 'Premium quality hybrid tomatoes. Freshly harvested, firm texture with excellent shelf life.',
        status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800',
      },
      {
        farmerId: farmerUser._id,
        cropName: 'Red Onions',
        category: 'vegetables',
        quantity: 1200,
        pricePerKg: 18,
        sellingType: 'bidding',
        location: 'Nashik, Maharashtra',
        description: 'Large red onions with strong flavour. Best quality from Nashik belt.',
        status: 'available',
        minimumBidAmount: 15,
        imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800',
      },
      {
        farmerId: farmerUser._id,
        cropName: 'Thompson Seedless Grapes',
        category: 'fruits',
        quantity: 300,
        pricePerKg: 85,
        sellingType: 'bidding',
        location: 'Nashik, Maharashtra',
        description: 'Export quality Thompson seedless grapes. Sweet taste, thin skin.',
        status: 'available',
        minimumBidAmount: 75,
        imageUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800',
      },
      {
        farmerId: farmerUser2._id,
        cropName: 'Organic Wheat',
        category: 'grains',
        quantity: 2000,
        pricePerKg: 28,
        sellingType: 'fixed',
        location: 'Pune, Maharashtra',
        description: 'Certified organic wheat, no pesticides used. High protein content.',
        status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800',
      },
      {
        farmerId: farmerUser2._id,
        cropName: 'Soybeans',
        category: 'pulses',
        quantity: 800,
        pricePerKg: 42,
        sellingType: 'fixed',
        location: 'Pune, Maharashtra',
        description: 'Non-GMO soybeans. High protein content, suitable for oil extraction.',
        status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=800',
      },
      {
        farmerId: farmerUser2._id,
        cropName: 'Sugarcane',
        category: 'others',
        quantity: 5000,
        pricePerKg: 3.5,
        sellingType: 'bidding',
        location: 'Pune, Maharashtra',
        description: 'Co-86032 variety sugarcane with high sugar recovery ratio.',
        status: 'available',
        minimumBidAmount: 3,
        imageUrl: 'https://images.unsplash.com/photo-1623227401046-e3a40d0f0c0e?w=800',
      },
      {
        farmerId: farmerUser._id,
        cropName: 'Green Chillies',
        category: 'spices',
        quantity: 200,
        pricePerKg: 55,
        sellingType: 'fixed',
        location: 'Nashik, Maharashtra',
        description: 'Spicy green chillies freshly picked. Ideal for restaurants and processors.',
        status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=800',
      },
      {
        farmerId: farmerUser2._id,
        cropName: 'Groundnuts',
        category: 'oilseeds',
        quantity: 600,
        pricePerKg: 65,
        sellingType: 'fixed',
        location: 'Pune, Maharashtra',
        description: 'Bold variety groundnuts. High oil content, suitable for direct consumption and oil extraction.',
        status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=800',
      },
    ]

    await Crop.insertMany(crops)

    console.log('\n🌱 Seed complete! Demo accounts created:\n')
    console.log('  👤 Admin   → admin@demo.com    / demo1234')
    console.log('  🌾 Farmer  → farmer@demo.com   / demo1234')
    console.log('  🌾 Farmer2 → farmer2@demo.com  / demo1234')
    console.log('  🏪 Trader  → trader@demo.com   / demo1234')
    console.log('  🏪 Trader2 → trader2@demo.com  / demo1234')
    console.log('\n  📦 8 sample crops created\n')

    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed failed:', err)
    process.exit(1)
  }
}

seed()
