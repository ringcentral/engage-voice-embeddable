/**
 * Props for the InitializeAudioPanel component
 */
export interface InitializeAudioViewProps {
  className?: string;
  /**
   * Whether the banner is applicable at all (feature enabled, logged in,
   * integrated softphone session).
   */
  show: boolean;
  onInitializeAudio: () => void;
}
