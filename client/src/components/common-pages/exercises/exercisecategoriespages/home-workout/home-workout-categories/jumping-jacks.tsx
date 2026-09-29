"use client";

import ExerciseDetailSkeleton from "../../skeleton-page-for-each-subcategoryexercise";
import { JUMPING_JACKS_DETAIL } from "./data"; 
export default function JumpingJacksPage() {
  return (
    <ExerciseDetailSkeleton data={JUMPING_JACKS_DETAIL} />
  );
}