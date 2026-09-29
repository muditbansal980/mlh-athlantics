"use client";

import ExerciseDetailSkeleton from "../../skeleton-page-for-each-subcategoryexercise";
import { RUSSIAN_TWISTS_DETAIL } from "./data"; 

export default function RussianTwistsPage() {
  return (
    <ExerciseDetailSkeleton data={RUSSIAN_TWISTS_DETAIL} />
  );
}