import { db } from '../../Config/firebase';
import { ref, get, child } from 'firebase/database';

// Fetch member information by JCIC number
export const getMemberByJCIC = async (jcic) => {
  try {
    const memberRef = ref(db, `Members/${jcic}`);
    
    const snapshot = await get(memberRef);
    
    if (snapshot.exists()) {
      const memberData = snapshot.val();
      // Ensure FamilyMembers is always an array
      if (!memberData.FamilyMembers) memberData.FamilyMembers = [];
      return {
        success: true,
        data: memberData
      };
    } else {
      return {
        success: false,
        error: 'jcic does not exists'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch member information'
    };
  }
};

// Check if member exists and has password (is signed up)
export const checkMemberSignupStatus = async (jcic) => {
  try {
    const memberRef = ref(db, `Members/${jcic}`);
    const snapshot = await get(memberRef);
    
    if (snapshot.exists()) {
      const memberData = snapshot.val();
      const hasPassword = memberData.Password && memberData.Password.trim() !== '';
      
      return {
        success: true,
        exists: true,
        hasPassword,
        data: memberData
      };
    } else {
      return {
        success: true,
        exists: false,
        hasPassword: false,
        data: null
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to check member status'
    };
  }
}; 