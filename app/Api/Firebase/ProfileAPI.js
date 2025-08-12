import { db } from '../../Config/firebase';
import { ref, get, update, set } from 'firebase/database';

// Get complete member profile from Firebase
export const getMemberProfile = async (jcic) => {
  try {
    const memberRef = ref(db, `Members/${jcic}`);
    const snapshot = await get(memberRef);
    
    if (snapshot.exists()) {
      const memberData = snapshot.val();
      
      return {
        success: true,
        data: {
          name: memberData.Name || '',
          email: memberData.Email || '',
          number: memberData.PhoneNum || memberData.number || '',
          jcic: memberData.JCIC || jcic,
          picture: memberData.Picture || '',
          fatherHusband: memberData.Father_Husband || '',
          surname: memberData.Surname || '',
          cnic: memberData.CNIC || '',
          age: memberData.Age || '',
          bloodGroup: memberData.BloodGroup || '',
          country: memberData.Country || '',
          dob: memberData.DOB || '',
          islamicDOB: memberData.IslamicDOB || '',
          business: memberData.business || [],
          familyMembers: memberData.FamilyMembers || []
        }
      };
    } else {
      return { success: false, error: 'Member not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get family members for a user
export const getFamilyMembers = async (jcic) => {
  try {
    const memberRef = ref(db, `Members/${jcic}`);
    const snapshot = await get(memberRef);
    
    if (!snapshot.exists()) {
      return { success: false, error: 'Member not found' };
    }
    
    const memberData = snapshot.val();
    const familyMembers = [];
    
    if (memberData.FamilyMembers && memberData.FamilyMembers.length > 0) {
      for (const familyJCIC of memberData.FamilyMembers) {
        try {
          const familyRef = ref(db, `Members/${familyJCIC}`);
          const familySnapshot = await get(familyRef);
          
          if (familySnapshot.exists()) {
            const familyData = familySnapshot.val();
            familyMembers.push({
              jcic: familyData.JCIC || familyJCIC,
              name: familyData.Name || '',
              email: familyData.Email || '',
              number: familyData.PhoneNum || familyData.number || '',
              fatherHusband: familyData.Father_Husband || '',
              surname: familyData.Surname || '',
              cnic: familyData.CNIC || '',
              picture: familyData.Picture || '',
              bloodGroup: familyData.BloodGroup || '',
              dob: familyData.DOB || '',
              islamicDOB: familyData.IslamicDOB || '',
            });
          }
        } catch (error) {
          console.log('Error fetching family member:', familyJCIC, error);
        }
      }
    }
    
    return { success: true, data: familyMembers };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all membership cards (user + family) for offline sync
export const getMembershipCards = async (jcic) => {
  try {
    // Get user's own card
    const userResult = await getMemberProfile(jcic);
    if (!userResult.success) {
      return { success: false, error: 'User not found' };
    }
    
    const userCard = {
      jcic: userResult.data.jcic,
      name: userResult.data.name,
      email: userResult.data.email,
      number: userResult.data.number,
      fatherHusband: userResult.data.fatherHusband,
      surname: userResult.data.surname,
      cnic: userResult.data.cnic,
      picture: userResult.data.picture,
      bloodGroup: userResult.data.bloodGroup,
      dob: userResult.data.dob,
      islamicDOB: userResult.data.islamicDOB,
    };
    
    // Get family member cards
    const familyResult = await getFamilyMembers(jcic);
    const familyCards = familyResult.success ? familyResult.data : [];
    
    return {
      success: true,
      data: {
        userCard,
        familyCards,
        lastUpdated: new Date().toISOString()
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Add family member to user's family list
export const addFamilyMember = async (userJCIC, familyJCIC) => {
  try {
    const memberRef = ref(db, `Members/${userJCIC}`);
    const snapshot = await get(memberRef);
    
    if (!snapshot.exists()) {
      return { success: false, error: 'User not found' };
    }
    
    // Verify family member exists
    const familyRef = ref(db, `Members/${familyJCIC}`);
    const familySnapshot = await get(familyRef);
    
    if (!familySnapshot.exists()) {
      return { success: false, error: 'Family member not found' };
    }
    
    const memberData = snapshot.val();
    const familyMembers = Array.isArray(memberData.FamilyMembers) ? [...memberData.FamilyMembers] : [];
    
    // Check if already added
    if (familyMembers.includes(String(familyJCIC))) {
      return { success: false, error: 'Family member already added' };
    }
    
    // Add family member
    familyMembers.push(String(familyJCIC));
    await update(memberRef, { FamilyMembers: familyMembers });
    
    return { success: true, data: familyMembers };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Remove family member from user's family list
export const removeFamilyMember = async (userJCIC, familyJCIC) => {
  try {
    const memberRef = ref(db, `Members/${userJCIC}`);
    const snapshot = await get(memberRef);
    
    if (!snapshot.exists()) {
      return { success: false, error: 'User not found' };
    }
    
    const memberData = snapshot.val();
    const familyMembers = Array.isArray(memberData.FamilyMembers) ? [...memberData.FamilyMembers] : [];
    
    const index = familyMembers.indexOf(String(familyJCIC));
    if (index === -1) {
      return { success: false, error: 'Family member not found in list' };
    }
    
    familyMembers.splice(index, 1);
    await update(memberRef, { FamilyMembers: familyMembers });
    
    return { success: true, data: familyMembers };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update member business details in Firebase
export const updateMemberBusiness = async (jcic, business) => {
  try {
    const memberRef = ref(db, `Members/${jcic}`);
    await update(memberRef, { business });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Add a new business to member
export const addMemberBusiness = async (jcic, businessData) => {
  try {
    const memberRef = ref(db, `Members/${jcic}`);
    const snapshot = await get(memberRef);
    if (!snapshot.exists()) return { success: false, error: 'Member not found' };
    
    const memberData = snapshot.val();
    const businessArr = Array.isArray(memberData.business) ? [...memberData.business] : [];
    businessArr.push(businessData);
    
    await update(memberRef, { business: businessArr });
    return { success: true, data: businessArr };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update a specific business by index
export const updateBusinessByIndex = async (jcic, index, businessData) => {
  try {
    const memberRef = ref(db, `Members/${jcic}`);
    const snapshot = await get(memberRef);
    if (!snapshot.exists()) return { success: false, error: 'Member not found' };
    
    const memberData = snapshot.val();
    const businessArr = Array.isArray(memberData.business) ? [...memberData.business] : [];
    if (index < 0 || index >= businessArr.length) return { success: false, error: 'Invalid index' };
    
    businessArr[index] = businessData;
    await update(memberRef, { business: businessArr });
    return { success: true, data: businessArr };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete a business by index for a member
export const deleteMemberBusiness = async (jcic, index) => {
  try {
    const memberRef = ref(db, `Members/${jcic}`);
    const snapshot = await get(memberRef);
    if (!snapshot.exists()) return { success: false, error: 'Member not found' };
    const memberData = snapshot.val();
    const businessArr = Array.isArray(memberData.business) ? [...memberData.business] : [];
    if (index < 0 || index >= businessArr.length) return { success: false, error: 'Invalid index' };
    businessArr.splice(index, 1);
    await update(memberRef, { business: businessArr });
    return { success: true, data: businessArr };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
