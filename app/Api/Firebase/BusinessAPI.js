import { db } from '../../Config/firebase';
import { ref, get } from 'firebase/database';
import stringSimilarity from 'string-similarity';

// Fetch all businesses from all members in Firebase
export const getAllBusinesses = async () => {
  try {
    const membersRef = ref(db, 'Members');
    const snapshot = await get(membersRef);
    if (!snapshot.exists()) return [];
    const members = snapshot.val();
    let businesses = [];
    Object.entries(members).forEach(([jcic, member]) => {
      if (Array.isArray(member.business)) {
        member.business.forEach(biz => {
          businesses.push({
            ...biz,
            ownerJCIC: jcic,
            ownerName: member.Name || '',
            ownerEmail: member.Email || '',
          });
        });
      }
    });
    return businesses;
  } catch (error) {
    return [];
  }
};

// Search businesses by name, owner, or work description
export const searchBusinesses = async (search = '', workDesc = '') => {
  const allBusinesses = await getAllBusinesses();
  const lowerSearch = search.toLowerCase();
  const lowerWorkDesc = workDesc.toLowerCase();

  // Tokenize the search query
  const searchTokens = lowerSearch.split(' ');
  const workDescTokens = lowerWorkDesc.split(' ');

  // Enhanced filtering with ranking
  const rankedBusinesses = allBusinesses.map(biz => {
    let score = 0;

    // Match business name
    if (biz.name) {
      const nameMatch = stringSimilarity.compareTwoStrings(biz.name.toLowerCase(), lowerSearch);
      score += nameMatch * 3; // Higher weight for name matches
    }

    // Match owner name
    if (biz.ownerName) {
      const ownerMatch = stringSimilarity.compareTwoStrings(biz.ownerName.toLowerCase(), lowerSearch);
      score += ownerMatch * 3; // Medium weight for owner matches
    }

    // Match description
    if (biz.description) {
      const descMatch = stringSimilarity.compareTwoStrings(biz.description.toLowerCase(), lowerWorkDesc);
      score += descMatch * 2; // Medium weight for description matches
    }

    // Match services
    if (biz.services) {
      const servicesMatch = workDescTokens.some(token => biz.services.toLowerCase().includes(token));
      if (servicesMatch) score += 1; // Lower weight for service matches
    }

    return { ...biz, score };
  });

  // Sort businesses by score in descending order
  const sortedBusinesses = rankedBusinesses.sort((a, b) => b.score - a.score);

  // Filter out businesses with zero score
  return sortedBusinesses.filter(biz => biz.score > 0);
};
