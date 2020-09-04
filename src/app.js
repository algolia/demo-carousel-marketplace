import { customCarousel } from './widgets/Carousel';

/* global algoliasearch instantsearch */
const searchClient = algoliasearch(
  'GENYJWQIK2',
  '61a10f4c69aee59a993ebc3021574681'
);

const search = instantsearch({
  indexName: 'e_commerce_transformed',
  searchClient,
});

const referenceHit = {
  name:
    'Apple - MacBook Air® (Latest Model) - 13.3" Display - Intel Core i5 - 8GB Memory - 128GB Flash Storage - Silver',
  description:
    'MacBook Air features up to 8GB of memory, a fifth-generation Intel Core processor, Thunderbolt 2, great built-in apps, and all-day battery life.1 Its thin, light, and durable enough to take everywhere you go-and powerful enough to do everything once you get there, better.',
  brand: 'Apple',
  categories: ['Computers & Tablets', 'Laptops', 'All Laptops', 'MacBooks'],
  hierarchicalCategories: {
    lvl0: 'Computers & Tablets',
    lvl1: 'Computers & Tablets > Laptops',
    lvl2: 'Computers & Tablets > Laptops > All Laptops',
    lvl3: 'Computers & Tablets > Laptops > All Laptops > MacBooks',
  },
  type: 'Apple',
  price: 999.99,
  price_range: '500 - 2000',
  image: 'https://cdn-demo.algolia.com/bestbuy-0118/6443034_sb.jpg',
  url: 'https://api.bestbuy.com/click/-/6443034/pdp',
  free_shipping: true,
  rating: 3,
  popularity: 21465,
  ratingsNumber: 368,
  onSale: true,
  newPrice: 786.64,
  seller: 'RandomSeller#4',
  objectID: '6443034',
};

const myCarousels = [
  {
    title: 'Popular right now',
    context: 'popular',
    indexName: 'e_commerce_transformed',
  },
  {
    title: 'Best rated items',
    context: 'best_rated',
    indexName: 'e_commerce_transformed_ratings_asc',
  },
  {
    title: 'On Sale',
    context: 'on_sale',
    indexName: 'e_commerce_transformed',
    extraConfig: {
      filters: 'onSale:true',
    },
  },
  {
    title: 'What you need to Work From Home',
    context: 'work_from_home',
    indexName: 'e_commerce_transformed',
    extraConfig: {
      hitsPerPage: 6,
    },
  },
  {
    title: 'Based on your purchase of Apple - Macbook Pro',
    context: 'related',
    indexName: 'e_commerce_transformed',
    relatedRef: referenceHit,
  },
  {
    title: 'These might interest you',
    context: 'curated',
    indexName: 'e_commerce_transformed',
    extraConfig: {
      optionalFilters: [
        'hierarchicalCategories.lvl0: Wearable Technology<score=5>',
        'hierarchicalCategories.lvl1: Cell Phones > All Cell Phones with Plans<score=5>',
      ],
    },
  },
];

const addWidgets = () => {
  search.addWidgets(
    myCarousels.map(carousel =>
      instantsearch.widgets
        .index({
          indexName: carousel.indexName,
          indexId: carousel.context,
        })
        .addWidgets(
          !carousel.relatedRef
            ? [
                instantsearch.widgets.configure({
                  ruleContexts: carousel.context,
                  hitsPerPage: 15,
                  query: '',
                  ...carousel.extraConfig,
                }),
                customCarousel({
                  container: '.carousels',
                  title: carousel.title,
                  context: carousel.context,
                }),
              ]
            : [
                instantsearch.widgets.configure({
                  ruleContexts: carousel.context,
                  hitsPerPage: 15,
                  query: '',
                  ...carousel.extraConfig,
                }),
                instantsearch.widgets.EXPERIMENTAL_configureRelatedItems({
                  hit: carousel.relatedRef,
                  matchingPatterns: {
                    brand: { score: 3 },
                  },
                }),
                customCarousel({
                  container: '.carousels',
                  title: carousel.title,
                  context: carousel.context,
                }),
              ]
        )
    )
  );
};

addWidgets();

search.start();
