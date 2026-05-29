export function getAuthFlowRoute({
  localeOnboardingDone,
  onboardingDone,
  isAuthenticated,
  permissionsGranted,
  authIntentRole,
}) {
  if (!localeOnboardingDone) return 'LanguageOnboarding';
  if (isAuthenticated) return null;
  if (!onboardingDone) return 'AuthIntro';
  if (!authIntentRole) return 'AuthChoice';
  if (authIntentRole === 'provider' && !permissionsGranted) return 'Permissions';
  return 'AuthChoice';
}
