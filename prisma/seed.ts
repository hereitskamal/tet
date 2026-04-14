import { config } from 'dotenv'
config({ path: '.env.local' })
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const categories = [
  { name: 'Living Room Furniture', slug: 'living-room-furniture' },
  { name: 'Bedroom Furniture', slug: 'bedroom-furniture' },
  { name: 'Dining Room Furniture', slug: 'dining-room-furniture' },
  { name: 'Office Furniture', slug: 'office-furniture' },
  { name: 'Decorative Accessories', slug: 'decorative-accessories' },
  { name: 'Lighting', slug: 'lighting' },
  { name: 'Rugs & Carpets', slug: 'rugs-carpets' },
  { name: 'Wall Art & Mirrors', slug: 'wall-art-mirrors' },
  { name: 'Kitchen & Dining', slug: 'kitchen-dining' },
  { name: 'Bathroom Accessories', slug: 'bathroom-accessories' },
  { name: 'Outdoor Furniture', slug: 'outdoor-furniture' },
  { name: 'Storage Solutions', slug: 'storage-solutions' },
]

const products = [
  // Living Room Furniture
  {
    name: 'Modern Sectional Sofa',
    slug: 'modern-sectional-sofa',
    description: 'A luxurious modular sectional sofa featuring premium Italian leather upholstery and adjustable headrests. Perfect for contemporary living spaces with its clean lines and comfortable seating.',
    price: 4500,
    compareAt: 5200,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    ],
    stock: 8,
    featured: true,
    categorySlug: 'living-room-furniture',
  },
  {
    name: 'Mid-Century Coffee Table',
    slug: 'mid-century-coffee-table',
    description: 'Elegant walnut coffee table with tapered legs and a spacious surface. Features a lower shelf for additional storage and display space.',
    price: 1200,
    images: [
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800',
    ],
    stock: 15,
    featured: false,
    categorySlug: 'living-room-furniture',
  },
  {
    name: 'Accent Armchair',
    slug: 'accent-armchair',
    description: 'Velvet upholstered armchair with brass-finished legs. The perfect statement piece for any living room or reading nook.',
    price: 1800,
    compareAt: 2200,
    images: [
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
    ],
    stock: 12,
    featured: true,
    categorySlug: 'living-room-furniture',
  },
  {
    name: 'TV Console Unit',
    slug: 'tv-console-unit',
    description: 'Modern entertainment center with cable management and storage compartments. Features a sleek oak finish with matte black hardware.',
    price: 2400,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    ],
    stock: 10,
    featured: false,
    categorySlug: 'living-room-furniture',
  },

  // Bedroom Furniture
  {
    name: 'Platform Bed Frame',
    slug: 'platform-bed-frame',
    description: 'Contemporary platform bed with integrated storage drawers. Made from sustainable hardwood with a natural finish.',
    price: 2800,
    compareAt: 3200,
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    ],
    stock: 20,
    featured: true,
    categorySlug: 'bedroom-furniture',
  },
  {
    name: 'Dresser with Mirror',
    slug: 'dresser-with-mirror',
    description: 'Eight-drawer dresser with an attached mirror. Features soft-close drawers and a distressed white finish.',
    price: 1600,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    ],
    stock: 14,
    featured: false,
    categorySlug: 'bedroom-furniture',
  },
  {
    name: 'Upholstered Headboard',
    slug: 'upholstered-headboard',
    description: 'Luxurious velvet headboard with button tufting. Attaches to any standard bed frame and adds instant elegance to your bedroom.',
    price: 800,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    ],
    stock: 25,
    featured: false,
    categorySlug: 'bedroom-furniture',
  },
  {
    name: 'Nightstand Set',
    slug: 'nightstand-set',
    description: 'Matching pair of modern nightstands with drawer storage and USB charging ports. Perfect for contemporary bedrooms.',
    price: 600,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    ],
    stock: 18,
    featured: false,
    categorySlug: 'bedroom-furniture',
  },

  // Dining Room Furniture
  {
    name: 'Extendable Dining Table',
    slug: 'extendable-dining-table',
    description: 'Solid oak dining table that extends from 6 to 10 seats. Features a self-storing leaf and tapered legs.',
    price: 3200,
    compareAt: 3800,
    images: [
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800',
    ],
    stock: 6,
    featured: true,
    categorySlug: 'dining-room-furniture',
  },
  {
    name: 'Upholstered Dining Chairs',
    slug: 'upholstered-dining-chairs',
    description: 'Set of 4 dining chairs with velvet upholstery and wooden legs. Comfortable and stylish for any dining room.',
    price: 1200,
    images: [
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
    ],
    stock: 12,
    featured: false,
    categorySlug: 'dining-room-furniture',
  },
  {
    name: 'Sideboard Cabinet',
    slug: 'sideboard-cabinet',
    description: 'Elegant sideboard with ample storage space and a marble top. Perfect for displaying dinnerware and serving pieces.',
    price: 2200,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    ],
    stock: 8,
    featured: false,
    categorySlug: 'dining-room-furniture',
  },

  // Office Furniture
  {
    name: 'Executive Desk',
    slug: 'executive-desk',
    description: 'Large executive desk with leather inlay and multiple drawers. Features a sturdy steel frame and walnut veneer top.',
    price: 2800,
    compareAt: 3400,
    images: [
      'https://images.unsplash.com/photo-1549497538-303791108f95?w=800',
    ],
    stock: 10,
    featured: true,
    categorySlug: 'office-furniture',
  },
  {
    name: 'Ergonomic Office Chair',
    slug: 'ergonomic-office-chair',
    description: 'Adjustable office chair with lumbar support and breathable mesh back. Perfect for long work sessions.',
    price: 900,
    images: [
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
    ],
    stock: 20,
    featured: false,
    categorySlug: 'office-furniture',
  },
  {
    name: 'Bookshelf Unit',
    slug: 'bookshelf-unit',
    description: 'Five-tier bookshelf with adjustable shelves and a modern design. Made from engineered wood with a white finish.',
    price: 450,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    ],
    stock: 15,
    featured: false,
    categorySlug: 'office-furniture',
  },

  // Decorative Accessories
  {
    name: 'Ceramic Vase Collection',
    slug: 'ceramic-vase-collection',
    description: 'Set of 3 handcrafted ceramic vases in varying sizes. Features a matte glaze finish and organic shapes.',
    price: 180,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    ],
    stock: 30,
    featured: false,
    categorySlug: 'decorative-accessories',
  },
  {
    name: 'Decorative Throw Pillows',
    slug: 'decorative-throw-pillows',
    description: 'Set of 4 decorative throw pillows with various patterns and textures. Includes feather inserts for comfort.',
    price: 120,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    ],
    stock: 25,
    featured: false,
    categorySlug: 'decorative-accessories',
  },
  {
    name: 'Macrame Wall Hanging',
    slug: 'macrame-wall-hanging',
    description: 'Hand-knotted macrame wall hanging with natural cotton rope. Adds texture and bohemian charm to any space.',
    price: 85,
    images: [
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800',
    ],
    stock: 20,
    featured: false,
    categorySlug: 'decorative-accessories',
  },

  // Lighting
  {
    name: 'Modern Pendant Light',
    slug: 'modern-pendant-light',
    description: 'Brass pendant light with an adjustable height cord. Features a frosted glass shade that diffuses light beautifully.',
    price: 320,
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800',
    ],
    stock: 15,
    featured: false,
    categorySlug: 'lighting',
  },
  {
    name: 'Floor Lamp with Shade',
    slug: 'floor-lamp-with-shade',
    description: 'Contemporary floor lamp with a linen shade and adjustable arm. Provides focused task lighting or ambient illumination.',
    price: 280,
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    ],
    stock: 12,
    featured: false,
    categorySlug: 'lighting',
  },
  {
    name: 'LED Table Lamp',
    slug: 'led-table-lamp',
    description: 'Modern table lamp with touch-sensitive dimming and USB charging port. Energy-efficient LED technology.',
    price: 150,
    images: [
      'https://images.unsplash.com/photo-1549497538-303791108f95?w=800',
    ],
    stock: 18,
    featured: false,
    categorySlug: 'lighting',
  },

  // Rugs & Carpets
  {
    name: 'Shag Area Rug',
    slug: 'shag-area-rug',
    description: 'Luxurious shag rug made from premium wool. Features a soft texture and neutral color that complements any decor.',
    price: 450,
    compareAt: 550,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    ],
    stock: 10,
    featured: true,
    categorySlug: 'rugs-carpets',
  },
  {
    name: 'Geometric Pattern Rug',
    slug: 'geometric-pattern-rug',
    description: 'Modern geometric pattern rug with bold colors. Made from durable synthetic fibers, perfect for high-traffic areas.',
    price: 280,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    ],
    stock: 14,
    featured: false,
    categorySlug: 'rugs-carpets',
  },

  // Wall Art & Mirrors
  {
    name: 'Abstract Canvas Art',
    slug: 'abstract-canvas-art',
    description: 'Large abstract canvas painting with vibrant colors. Adds a contemporary focal point to any wall.',
    price: 380,
    images: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
    ],
    stock: 8,
    featured: false,
    categorySlug: 'wall-art-mirrors',
  },
  {
    name: 'Round Wall Mirror',
    slug: 'round-wall-mirror',
    description: 'Decorative round mirror with a gold-finished frame. Perfect for entryways or bathrooms.',
    price: 220,
    images: [
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800',
    ],
    stock: 12,
    featured: false,
    categorySlug: 'wall-art-mirrors',
  },

  // Kitchen & Dining
  {
    name: 'Bar Stool Set',
    slug: 'bar-stool-set',
    description: 'Set of 2 upholstered bar stools with footrests. Features adjustable height and swivel seats.',
    price: 480,
    images: [
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
    ],
    stock: 16,
    featured: false,
    categorySlug: 'kitchen-dining',
  },
  {
    name: 'Kitchen Island Cart',
    slug: 'kitchen-island-cart',
    description: 'Mobile kitchen island with storage drawers and a butcher block top. Perfect for small kitchens or entertaining.',
    price: 650,
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    ],
    stock: 10,
    featured: false,
    categorySlug: 'kitchen-dining',
  },

  // Bathroom Accessories
  {
    name: 'Freestanding Vanity',
    slug: 'freestanding-vanity',
    description: 'Modern freestanding vanity with quartz countertop and soft-close drawers. Includes a porcelain sink basin.',
    price: 1200,
    compareAt: 1400,
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800',
    ],
    stock: 8,
    featured: false,
    categorySlug: 'bathroom-accessories',
  },
  {
    name: 'Towel Rack Set',
    slug: 'towel-rack-set',
    description: 'Brushed nickel towel rack set including towel bars, rings, and hooks. Modern design with clean lines.',
    price: 180,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    ],
    stock: 20,
    featured: false,
    categorySlug: 'bathroom-accessories',
  },

  // Outdoor Furniture
  {
    name: 'Outdoor Dining Set',
    slug: 'outdoor-dining-set',
    description: 'Weather-resistant outdoor dining set including table and 4 chairs. Made from eucalyptus wood with aluminum accents.',
    price: 1800,
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
    ],
    stock: 6,
    featured: false,
    categorySlug: 'outdoor-furniture',
  },
  {
    name: 'Patio Lounge Chair',
    slug: 'patio-lounge-chair',
    description: 'Comfortable outdoor lounge chair with adjustable backrest. Features weather-resistant fabric and powder-coated frame.',
    price: 650,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    ],
    stock: 12,
    featured: false,
    categorySlug: 'outdoor-furniture',
  },

  // Storage Solutions
  {
    name: 'Modular Storage System',
    slug: 'modular-storage-system',
    description: 'Customizable modular storage system with various sized cubes. Perfect for organizing any room in your home.',
    price: 850,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    ],
    stock: 15,
    featured: false,
    categorySlug: 'storage-solutions',
  },
  {
    name: 'Entryway Bench',
    slug: 'entryway-bench',
    description: 'Storage bench for entryways with lift-up seat and interior storage. Features a cushioned top and coat hooks.',
    price: 420,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    ],
    stock: 10,
    featured: false,
    categorySlug: 'storage-solutions',
  },
]

async function main() {
  console.log('Seeding database...')

  try {
    // Clear existing data in correct order (products first due to foreign key)
    console.log('Clearing existing products and categories...')
    await prisma.product.deleteMany({})
    console.log('Products cleared.')
    await prisma.category.deleteMany({})
    console.log('Categories cleared.')

    // Create categories
    console.log('Creating categories...')
    const categoryMap: Record<string, string> = {}
    for (const cat of categories) {
      const created = await prisma.category.create({
        data: cat,
      })
      categoryMap[cat.slug] = created.id
    }
    console.log('Categories created.')

    // Create products
    console.log('Creating products...')
    for (const product of products) {
      const { categorySlug, ...data } = product
      await prisma.product.create({
        data: {
          ...data,
          categoryId: categoryMap[categorySlug],
        },
      })
    }
    console.log('Products created.')

    // Create admin user (only if doesn't exist)
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@tht.com' },
    })

    if (!adminExists) {
      const adminPassword = await bcrypt.hash('admin123', 12)
      await prisma.user.create({
        data: {
          email: 'admin@tht.com',
          password: adminPassword,
          name: 'Admin',
          role: 'ADMIN',
        },
      })
      console.log('Admin user created.')
    }

    // Create test user (only if doesn't exist)
    const userExists = await prisma.user.findUnique({
      where: { email: 'user@tht.com' },
    })

    if (!userExists) {
      const userPassword = await bcrypt.hash('user123', 12)
      await prisma.user.create({
        data: {
          email: 'user@tht.com',
          password: userPassword,
          name: 'Test User',
          role: 'USER',
        },
      })
      console.log('Test user created.')
    }

    console.log('Seeding complete.')
    console.log('Admin: admin@tht.com / admin123')
    console.log('User:  user@tht.com / user123')
  } catch (error) {
    console.error('Seeding failed:', error)
    throw error
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
