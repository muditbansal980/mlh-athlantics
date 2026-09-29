"use client";

import ExerciseDetailSkeleton from "../../skeleton-page-for-each-subcategoryexercise";
import {PLANK_JACKS_DETAIL } from "./data"; 

export default function PlankJacksPage() {
  return (
    <ExerciseDetailSkeleton data={PLANK_JACKS_DETAIL} />
  );
}