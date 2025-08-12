import { db } from '../../Config/firebase';
import { ref, get } from 'firebase/database';

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
  return allBusinesses.filter(biz => {
    const nameMatch = biz.name && biz.name.toLowerCase().includes(lowerSearch);
    const ownerMatch = biz.ownerName && biz.ownerName.toLowerCase().includes(lowerSearch);
    const descMatch = biz.description && biz.description.toLowerCase().includes(lowerWorkDesc);
    return (
      (!search || nameMatch || ownerMatch) &&
      (!workDesc || descMatch)
    );
  });
};
