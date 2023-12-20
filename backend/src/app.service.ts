import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './stores/stores.entity';
import { Item } from './items/items.entity';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}
  getHello(): string {
    return 'indexPage';
  }
  async onModuleInit() {
    const store = await this.storeRepository.findOneBy({
      uuid: '0c60121d-0e36-4b93-b5c6-35a4f5fac613',
    });
    if (store) {
      await this.storeRepository.delete(store.uuid);
    }
    await this.storeRepository.insert({
      uuid: '0c60121d-0e36-4b93-b5c6-35a4f5fac613',
      name: 'Demo store',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      coverUrl:
        'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=2952&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    });
    this.itemRepository.insert([
      {
        name: 'Elegant Watch',
        description:
          'Discover the timeless elegance of our Lorem Ipsum Classic Watch. Crafted with precision and style, this watch seamlessly blends sophistication with modern design. The minimalist face and stainless steel band make it a perfect accessory for any occasion.',
        price: 9999,
        imageUrls: [
          'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=3088&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2F0Y2h8ZW58MHx8MHx8fDA%3D',
          'https://images.unsplash.com/photo-1526045431048-f857369baa09?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D',
        ],
        store: {
          uuid: '0c60121d-0e36-4b93-b5c6-35a4f5fac613',
        },
        url: 'https://www.amazon.com/Grand-Seiko-Elegance-Mechanical-GMT/dp/B07SXBT9VC/ref=sr_1_2?keywords=elegant+watches+for+men&qid=1703013487&sr=8-2',
      },
      {
        name: 'Adventure Backpack',
        description:
          "Embark on your next adventure with the Ipsum Expedition Backpack. Designed for durability and comfort, this spacious backpack features multiple compartments for organized storage. Whether you're a city explorer or a nature enthusiast, this backpack is your ideal companion.",
        price: 7999,
        imageUrls: [
          'https://images.unsplash.com/photo-1592388748465-8c4dca8dd703?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YWR2ZW50dXJlJTIwYmFja3BhY2t8ZW58MHx8MHx8fDA%3D',
          'https://images.unsplash.com/19/nomad.JPG?q=80&w=2515&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ],
        store: {
          uuid: '0c60121d-0e36-4b93-b5c6-35a4f5fac613',
        },
        url: 'https://www.amazon.com/High-Sierra-Backpack-Hydration-Traveling/dp/B0C3WJK23R/ref=sr_1_3?crid=2XDBIYKUR94WW&keywords=backpack+camping&qid=1703013553&sprefix=backpack+campin%2Caps%2C200&sr=8-3',
      },
      {
        name: "Tech Enthusiast's Laptop",
        description:
          'Unleash the power of innovation with the LoremTech Pro Laptop. Packed with cutting-edge features and a sleek, lightweight design, this laptop is perfect for tech enthusiasts and professionals alike. Elevate your computing experience with speed, style, and reliability.',
        price: 129999,
        imageUrls: [
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1487611459768-bd414656ea10?q=80&w=2880&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ],
        store: {
          uuid: '0c60121d-0e36-4b93-b5c6-35a4f5fac613',
        },
        url: 'https://www.amazon.com/Apple-2023-MacBook-Laptop-chip/dp/B0C76B7QHC/ref=sr_1_1?crid=1NDAXAGRN850P&keywords=macbook&qid=1703013581&sprefix=macbo%2Caps%2C243&sr=8-1',
      },
      {
        name: 'Serene Aromatherapy Diffuser',
        description:
          'Transform your living space into a haven of tranquility with our Serene Aromatherapy Diffuser. Crafted with a minimalist design, this diffuser combines modern aesthetics with the soothing power of aromatherapy. Create a serene atmosphere by diffusing your favorite essential oils, promoting relaxation and well-being. Enhance your home environment with the Serene Aromatherapy Diffuser.',
        price: 3999,
        imageUrls: [
          'https://images.unsplash.com/photo-1616817727790-4cc1975d00cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8U2VyZW5lJTIwQXJvbWF0aGVyYXB5JTIwRGlmZnVzZXJ8ZW58MHx8MHx8fDA%3D',
          'https://images.unsplash.com/photo-1632322831476-f8c68bef7dba?q=80&w=3175&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ],
        store: {
          uuid: '0c60121d-0e36-4b93-b5c6-35a4f5fac613',
        },
        url: 'https://www.amazon.com/Acqua-dellElba-Ambiente-Profumatore-1000ml/dp/B06X427X5X/ref=sr_1_11?crid=1AVMEXN0NT1Z7&keywords=Serene+Aromatherapy+Diffuser&qid=1703013606&sprefix=serene+aromatherapy+diffuser%2Caps%2C189&sr=8-11',
      },
      {
        name: 'Vintage-Inspired Record Player',
        description:
          'Rediscover the magic of vinyl with our Vintage-Inspired Record Player. Immerse yourself in the warm, nostalgic sound of classic records while enjoying the timeless design of this stylish player. With built-in speakers and a retro aesthetic, this record player is a perfect blend of old-school charm and modern technology. Experience the joy of vinyl with our Vintage-Inspired Record Player',
        price: 12999,
        imageUrls: [
          'https://images.unsplash.com/photo-1616714107834-a00f7d6f8d72?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1616714109948-c74fe5029a4d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8UmVjb3JkJTIwUGxheWVyfGVufDB8fDB8fHww',
        ],
        store: {
          uuid: '0c60121d-0e36-4b93-b5c6-35a4f5fac613',
        },
        url: 'https://www.amazon.com/Victrola-Bluetooth-Espresso-Portable-Turntable/dp/B08BRNY3Q3/ref=sr_1_3?crid=3MOQHYOQ7FIUQ&keywords=Vintage-Inspired+Record+Player&qid=1703013632&sprefix=vintage-inspired+record+player%2Caps%2C228&sr=8-3',
      },
      {
        name: 'Cozy Cable-Knit Throw Blanket',
        description:
          'Wrap yourself in comfort and style with our Cozy Cable-Knit Throw Blanket. Made from luxurious, soft yarn, this blanket adds a touch of warmth and elegance to any space. The classic cable-knit pattern enhances its visual appeal, making it a versatile accessory for your living room or bedroom. Embrace coziness and relaxation with the Cozy Cable-Knit Throw Blanket.',
        price: 4999,
        imageUrls: [
          'https://images.unsplash.com/photo-1514566591832-b79c8b92bdbb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fENvenklMjBDYWJsZSUyMEtuaXQlMjBUaHJvdyUyMEJsYW5rZXR8ZW58MHx8MHx8fDA%3D',
        ],
        store: {
          uuid: '0c60121d-0e36-4b93-b5c6-35a4f5fac613',
        },
        url: 'https://www.amazon.com/vctops-Blanket-Blankets-Pompom-Knitted/dp/B082XZZ8ML/ref=sr_1_4?crid=2YLTBENQ35WI8&keywords=Cozy+Cable-Knit+Throw+Blanket&qid=1703013662&sprefix=cozy+cable-knit+throw+blanket%2Caps%2C217&sr=8-4',
      },
    ]);
  }
}
