import { db } from '../../Config/firebase';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';

// Search members by a specific field
export const searchMembersByField = async (field, value) => {
  try {
    const membersRef = ref(db, 'Members');
    const snapshot = await get(membersRef);
    
    if (snapshot.exists()) {
      const members = snapshot.val();
      const results = [];
      
      for (const jcic in members) {
        if (members[jcic][field] && 
            members[jcic][field].toString().toLowerCase().includes(value.toLowerCase())) {
          results.push({
            jcic,
            ...members[jcic]
          });
        }
      }
      
      return { success: true, data: results };
    }
    
    return { success: true, data: [] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all members (use with caution for large datasets)
export const getAllMembers = async () => {
  try {
    const membersRef = ref(db, 'Members');
    const snapshot = await get(membersRef);
    
    if (snapshot.exists()) {
      const members = snapshot.val();
      return { success: true, data: members };
    }
    
    return { success: true, data: {} };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Transform Firebase member data to match expected format
export const transformMemberData = (memberData, jcic) => {
  return {
    jcic: jcic,
    name: memberData.Name || '',
    surname: memberData.Surname || '',
    fatherHusband: memberData.Father_Husband || '',
    age: memberData.Age || '',
    bloodGroup: memberData.BloodGroup || '',
    cnic: memberData.CNIC || '',
    country: memberData.Country || '',
    dob: memberData.DOB || '',
    islamicDob: memberData.IslamicDOB || '',
    email: memberData.Email || '',
    picture: memberData.Picture || '',
    phone: memberData.Phone || '',
    hasPassword: !!(memberData.Password && memberData.Password.trim() !== '')
  };
};

// Validate JCIC format
export const validateJCIC = (jcic) => {
  if (!jcic) return false;
  
  // JCIC should be a 16-digit number
  const jcicRegex = /^\d{16}$/;
  return jcicRegex.test(jcic);
};

// Clean up sensitive data before sending to client
export const sanitizeMemberData = (memberData) => {
  const { Password, ...sanitizedData } = memberData;
  return sanitizedData;
}; 