

import LandingPage from './LandingPage/landing_page';
import UserLogin from './LoginPage/user/page';
import TrainerLogin from './LoginPage/trainer_login';
import SignUpPage from './SignUpPage/user/page';
import TrainerSignUpPage from './SignUpPage/trainer/page';

export default function RenderPage() {
  return (
    <div>
      {/* <h1>Render Landing Page</h1> */}
      <LandingPage />
    </div>
  );
}
