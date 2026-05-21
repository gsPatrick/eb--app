export function getAuthFlowRoute({
  localeOnboardingDone,
  onboardingDone,
  isAuthenticated,
  permissionsGranted,
}) {
  if (!localeOnboardingDone) return 'LanguageOnboarding';
  if (!permissionsGranted) return 'Permissions';
  if (isAuthenticated) return null;
  if (!onboardingDone) return 'AuthIntro';
  return 'AuthChoice';
}
