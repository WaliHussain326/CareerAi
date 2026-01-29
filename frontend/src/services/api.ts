import axios from '../lib/axios';

// ==================== Auth API ====================
export interface SignupRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export const authAPI = {
  signup: (data: SignupRequest) => 
    axios.post<AuthResponse>('/auth/signup', data),
  
  login: (data: LoginRequest) => 
    axios.post<AuthResponse>('/auth/login', data),
  
  getCurrentUser: () => 
    axios.get<User>('/auth/me'),
  
  logout: () => 
    axios.post('/auth/logout'),
  
  refreshToken: (refresh_token: string) => 
    axios.post<AuthResponse>('/auth/refresh', { refresh_token }),
};

// ==================== Onboarding API ====================
export interface OnboardingData {
  education_level: string;
  field_of_study: string;
  interests: string[];
  skills: string[];
  career_goals: string;
  preferred_work_environment: string;
}

export interface OnboardingResponse {
  id: number;
  user_id: number;
  education_level: string;
  field_of_study: string;
  interests: string[];
  skills: string[];
  career_goals: string;
  preferred_work_environment: string;
  created_at: string;
  updated_at: string;
}

export const onboardingAPI = {
  submit: (data: OnboardingData) => 
    axios.post<OnboardingResponse>('/onboarding', data),
  
  get: () => 
    axios.get<OnboardingResponse>('/onboarding'),
  
  update: (data: Partial<OnboardingData>) => 
    axios.put<OnboardingResponse>('/onboarding', data),
  
  delete: () => 
    axios.delete('/onboarding'),
};

// ==================== Quiz API ====================
export interface QuizQuestion {
  id: number;
  question_text: string;
  question_type: string;
  category: string;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  id: number;
  question_id: number;
  answer_text: string;
  weight: number;
}

export interface QuizSubmission {
  answers: {
    question_id: number;
    answer_id: number;
  }[];
}

export interface QuizSubmissionResponse {
  id: number;
  user_id: number;
  submitted_at: string;
  answers: Array<{
    question_id: number;
    answer_id: number;
  }>;
}

export const quizAPI = {
  getQuestions: () => 
    axios.get<QuizQuestion[]>('/quiz/questions'),
  
  getQuestion: (id: number) => 
    axios.get<QuizQuestion>(`/quiz/questions/${id}`),
  
  submitQuiz: (data: QuizSubmission) => 
    axios.post<QuizSubmissionResponse>('/quiz/submit', data),
  
  getSubmissions: () => 
    axios.get<QuizSubmissionResponse[]>('/quiz/submissions'),
  
  getSubmission: (id: number) => 
    axios.get<QuizSubmissionResponse>(`/quiz/submissions/${id}`),
  
  deleteSubmission: (id: number) => 
    axios.delete(`/quiz/submissions/${id}`),
};

// ==================== Careers API ====================
export interface SkillGap {
  id: number;
  skill_name: string;
  importance: string;
  resources: string[];
}

export interface LearningRoadmapStep {
  id: number;
  phase: string;
  duration: string;
  topics: string[];
  resources: string[];
}

export interface CareerRecommendation {
  id: number;
  user_id: number;
  career_title: string;
  match_score: number;
  description: string;
  required_skills: string[];
  salary_range: string;
  growth_potential: string;
  created_at: string;
  skill_gaps?: SkillGap[];
  learning_roadmap?: LearningRoadmapStep[];
}

export const careersAPI = {
  generateRecommendations: () => 
    axios.post<CareerRecommendation[]>('/careers/generate'),
  
  getRecommendations: () => 
    axios.get<CareerRecommendation[]>('/careers'),
  
  getRecommendation: (id: number) => 
    axios.get<CareerRecommendation>(`/careers/${id}`),
  
  getSkillGaps: (recommendation_id: number) => 
    axios.get<SkillGap[]>(`/careers/${recommendation_id}/skill-gaps`),
  
  getLearningRoadmap: (recommendation_id: number) => 
    axios.get<LearningRoadmapStep[]>(`/careers/${recommendation_id}/roadmap`),
};

// ==================== Admin API ====================
export interface PlatformStats {
  total_users: number;
  active_users: number;
  total_quiz_submissions: number;
  total_recommendations: number;
}

export interface RecentActivity {
  id: number;
  user_email: string;
  activity_type: string;
  timestamp: string;
}

export const adminAPI = {
  getUsers: (skip?: number, limit?: number) => 
    axios.get<User[]>('/admin/users', { params: { skip, limit } }),
  
  getUser: (id: number) => 
    axios.get<User>(`/admin/users/${id}`),
  
  updateUser: (id: number, data: Partial<User>) => 
    axios.put<User>(`/admin/users/${id}`, data),
  
  deleteUser: (id: number) => 
    axios.delete(`/admin/users/${id}`),
  
  getStats: () => 
    axios.get<PlatformStats>('/admin/stats'),
  
  getRecentActivity: (limit?: number) => 
    axios.get<RecentActivity[]>('/admin/recent-activity', { params: { limit } }),
};
