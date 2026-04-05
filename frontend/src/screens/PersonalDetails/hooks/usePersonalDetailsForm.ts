import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import {
  useUserProfile,
  type BloodGroupOption,
  type GenderOption,
} from '@/firestore';
import { MAX_AGE, MIN_AGE } from '../constants';

export const usePersonalDetailsForm = () => {
  const { user } = useAuth();
  const {
    profile,
    loading,
    error,
    updateProfile,
    removeProfileAge,
    removeProfileBloodGroup,
  } = useUserProfile();

  const [genderModalOpen, setGenderModalOpen] = useState<boolean>(false);
  const [bloodModalOpen, setBloodModalOpen] = useState<boolean>(false);
  const [safetyExpanded, setSafetyExpanded] = useState<boolean>(false);
  const [additionalExpanded, setAdditionalExpanded] = useState<boolean>(false);

  const [ageInput, setAgeInput] = useState<number | null>(null);
  const [cityDraft, setCityDraft] = useState<string>('');
  const [emergencyDraft, setEmergencyDraft] = useState<string>('');
  const [medicalDraft, setMedicalDraft] = useState<string>('');
  const [occupationDraft, setOccupationDraft] = useState<string>('');
  const [livingDraft, setLivingDraft] = useState<string>('');

  const [savingGender, setSavingGender] = useState<boolean>(false);
  const [savingBlood, setSavingBlood] = useState<boolean>(false);
  const [savingAge, setSavingAge] = useState<boolean>(false);
  const [savingExtras, setSavingExtras] = useState<boolean>(false);
  const [ageHint, setAgeHint] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.age != null && !Number.isNaN(profile.age)) {
      setAgeInput(profile.age);
    } else {
      setAgeInput(null);
    }
  }, [profile?.age]);

  useEffect(() => {
    setCityDraft(profile?.cityOrArea ?? '');
    setEmergencyDraft(profile?.emergencyContact ?? '');
    setMedicalDraft(profile?.medicalNotes ?? '');
    setOccupationDraft(profile?.occupation ?? '');
    setLivingDraft(profile?.livingSituation ?? '');
  }, [
    profile?.cityOrArea,
    profile?.emergencyContact,
    profile?.medicalNotes,
    profile?.occupation,
    profile?.livingSituation,
  ]);

  const authDisplayName =
    user?.displayName?.trim() ||
    (user?.email ? user.email.split('@')[0] : '') ||
    '—';
  const authEmail = user?.email ?? '—';
  const editable = !!user?.uid;

  const pickGender = useCallback(
    async (value: GenderOption) => {
      setSavingGender(true);
      try {
        await updateProfile({ gender: value });
        setGenderModalOpen(false);
      } finally {
        setSavingGender(false);
      }
    },
    [updateProfile],
  );

  const pickBloodGroup = useCallback(
    async (value: BloodGroupOption) => {
      setSavingBlood(true);
      try {
        await updateProfile({ bloodGroup: value });
        setBloodModalOpen(false);
      } finally {
        setSavingBlood(false);
      }
    },
    [updateProfile],
  );

  const clearBloodGroup = useCallback(async () => {
    setSavingBlood(true);
    try {
      await removeProfileBloodGroup();
      setBloodModalOpen(false);
    } finally {
      setSavingBlood(false);
    }
  }, [removeProfileBloodGroup]);

  const commitAge = useCallback(async () => {
    setAgeHint(null);
    if (ageInput === null) {
      if (profile?.age != null) {
        setSavingAge(true);
        try {
          await removeProfileAge();
        } finally {
          setSavingAge(false);
        }
      }
      return;
    }
    const n = ageInput;
    if (n < MIN_AGE || n > MAX_AGE) {
      setAgeHint(`Age must be between ${MIN_AGE} and ${MAX_AGE}.`);
      setAgeInput(profile?.age != null ? profile.age : null);
      return;
    }
    if (n === profile?.age) return;
    setSavingAge(true);
    try {
      await updateProfile({ age: n });
    } finally {
      setSavingAge(false);
    }
  }, [ageInput, profile?.age, removeProfileAge, updateProfile]);

  const commitCity = useCallback(async () => {
    const next = cityDraft.trim();
    const prev = profile?.cityOrArea ?? '';
    if (next === prev) return;
    setSavingExtras(true);
    try {
      await updateProfile({ cityOrArea: next });
    } finally {
      setSavingExtras(false);
    }
  }, [cityDraft, profile?.cityOrArea, updateProfile]);

  const commitEmergency = useCallback(async () => {
    const next = emergencyDraft.trim();
    const prev = profile?.emergencyContact ?? '';
    if (next === prev) return;
    setSavingExtras(true);
    try {
      await updateProfile({ emergencyContact: next });
    } finally {
      setSavingExtras(false);
    }
  }, [emergencyDraft, profile?.emergencyContact, updateProfile]);

  const commitMedical = useCallback(async () => {
    const next = medicalDraft.trim();
    const prev = profile?.medicalNotes ?? '';
    if (next === prev) return;
    setSavingExtras(true);
    try {
      await updateProfile({ medicalNotes: next });
    } finally {
      setSavingExtras(false);
    }
  }, [medicalDraft, profile?.medicalNotes, updateProfile]);

  const commitOccupation = useCallback(async () => {
    const next = occupationDraft.trim();
    const prev = profile?.occupation ?? '';
    if (next === prev) return;
    setSavingExtras(true);
    try {
      await updateProfile({ occupation: next });
    } finally {
      setSavingExtras(false);
    }
  }, [occupationDraft, profile?.occupation, updateProfile]);

  const commitLiving = useCallback(async () => {
    const next = livingDraft.trim();
    const prev = profile?.livingSituation ?? '';
    if (next === prev) return;
    setSavingExtras(true);
    try {
      await updateProfile({ livingSituation: next });
    } finally {
      setSavingExtras(false);
    }
  }, [livingDraft, profile?.livingSituation, updateProfile]);

  return {
    profile,
    loading,
    error,
    editable,
    authDisplayName,
    authEmail,
    genderModalOpen,
    setGenderModalOpen,
    bloodModalOpen,
    setBloodModalOpen,
    safetyExpanded,
    setSafetyExpanded,
    additionalExpanded,
    setAdditionalExpanded,
    ageInput,
    setAgeInput,
    ageHint,
    setAgeHint,
    savingAge,
    commitAge,
    cityDraft,
    setCityDraft,
    commitCity,
    emergencyDraft,
    setEmergencyDraft,
    commitEmergency,
    medicalDraft,
    setMedicalDraft,
    commitMedical,
    occupationDraft,
    setOccupationDraft,
    commitOccupation,
    livingDraft,
    setLivingDraft,
    commitLiving,
    savingGender,
    savingBlood,
    savingExtras,
    pickGender,
    pickBloodGroup,
    clearBloodGroup,
  };
};
