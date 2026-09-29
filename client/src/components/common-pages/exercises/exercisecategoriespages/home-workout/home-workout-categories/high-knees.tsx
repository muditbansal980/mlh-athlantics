"use client";

import ExerciseDetailSkeleton from "../../skeleton-page-for-each-subcategoryexercise";
import { HIGH_KNEES_DETAIL } from "./data"; 

export default function HighKneesPage() {
  return (
    <ExerciseDetailSkeleton data={HIGH_KNEES_DETAIL} />
  );
}