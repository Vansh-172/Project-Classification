export const mushroomFeatures = [
  { name: 'cap-shape', label: 'Cap shape', options: ['Bell', 'Conical', 'Convex', 'Flat', 'Knobbed', 'Sunken'] },
  { name: 'cap-surface', label: 'Cap surface', options: ['Fibrous', 'Grooves', 'Scaly', 'Smooth'] },
  { name: 'cap-color', label: 'Cap color', options: ['Brown', 'Buff', 'Cinnamon', 'Gray', 'Green', 'Pink', 'Purple', 'Red', 'White', 'Yellow'] },
  { name: 'bruises', label: 'Bruises', options: ['Bruises', 'No Bruises'] },
  { name: 'odor', label: 'Odor', options: ['Almond', 'Anise', 'Creosote', 'Fishy', 'Foul', 'Musty', 'None', 'Pungent', 'Spicy'] },
  { name: 'gill-attachment', label: 'Gill attachment', options: ['Attached', 'Descending', 'Free', 'Notched'] },
  { name: 'gill-spacing', label: 'Gill spacing', options: ['Close', 'Crowded', 'Distant'] },
  { name: 'gill-size', label: 'Gill size', options: ['Broad', 'Narrow'] },
  { name: 'gill-color', label: 'Gill color', options: ['Black', 'Brown', 'Buff', 'Chocolate', 'Gray', 'Green', 'Orange', 'Pink', 'Purple', 'Red', 'White', 'Yellow'] },
  { name: 'stalk-shape', label: 'Stalk shape', options: ['Enlarging', 'Tapering'] },
  { name: 'stalk-root', label: 'Stalk root', options: ['Bulbous', 'Club', 'Cup', 'Equal', 'Rhizomorphs', 'Rooted'] },
  { name: 'stalk-surface-above-ring', label: 'Stalk surface above ring', options: ['Fibrous', 'Scaly', 'Silky', 'Smooth'] },
  { name: 'stalk-surface-below-ring', label: 'Stalk surface below ring', options: ['Fibrous', 'Scaly', 'Silky', 'Smooth'] },
  { name: 'stalk-color-above-ring', label: 'Stalk color above ring', options: ['Brown', 'Buff', 'Cinnamon', 'Gray', 'Orange', 'Pink', 'Red', 'White', 'Yellow'] },
  { name: 'stalk-color-below-ring', label: 'Stalk color below ring', options: ['Brown', 'Buff', 'Cinnamon', 'Gray', 'Orange', 'Pink', 'Red', 'White', 'Yellow'] },
  { name: 'veil-color', label: 'Veil color', options: ['Brown', 'Orange', 'White', 'Yellow'] },
  { name: 'ring-number', label: 'Ring number', options: ['None', 'One', 'Two'] },
  { name: 'ring-type', label: 'Ring type', options: ['Cobwebby', 'Evanescent', 'Flaring', 'Large', 'None', 'Pendant', 'Sheathing', 'Zone'] },
  { name: 'spore-print-color', label: 'Spore print color', options: ['Black', 'Brown', 'Buff', 'Chocolate', 'Green', 'Orange', 'Purple', 'White', 'Yellow'] },
  { name: 'population', label: 'Population', options: ['Abundant', 'Clustered', 'Numerous', 'Scattered', 'Several', 'Solitary'] },
  { name: 'habitat', label: 'Habitat', options: ['Grasses', 'Leaves', 'Meadows', 'Paths', 'Urban', 'Waste', 'Woods'] },
];

export const emptyMushroomValues = mushroomFeatures.reduce((values, feature) => {
  values[feature.name] = '';
  return values;
}, {});
