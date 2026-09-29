"use client";

import ExerciseDetailSkeleton from "../../skeleton-page-for-each-subcategoryexercise";
import { BURPEES_DETAIL } from "./data"; 

export default function BurpeesPage() {
  return (
    <ExerciseDetailSkeleton data={BURPEES_DETAIL} />
  );
}