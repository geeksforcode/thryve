import { db } from 'src/db/client';
import {
  profiles,
  companies,
  artistsProfiles,
  investorsProfiles,
} from 'src/db/schema';

export const newProfiles = async (
  role: string,
  user: number,
  email: string,
  username: string,
) => {
  if (role == 'job-seeker') {
    const profile = await db
      .insert(profiles)
      .values({ userId: user, email: email })
      .returning();

    return profile;
  } else if (role == 'investor') {
    const profile = await db
      .insert(investorsProfiles)
      .values({ userId: user, email: email })
      .returning();

    return profile;
  } else if (role == 'artist') {
    const profile = await db
      .insert(artistsProfiles)
      .values({ userId: user, email: email })
      .returning();
    return profile;
  } else if (role == 'employer') {
    const profile = await db
      .insert(companies)
      .values({ userId: user, email: email, companyName: username })
      .returning();

    return profile;
  } else {
    return null;
  }
};
