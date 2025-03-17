/**
 * Type definitions for Google Identity Services
 */
declare namespace google {
  namespace accounts {
    namespace id {
      interface IdConfiguration {
        client_id: string;
        auto_select?: boolean;
        callback?: (response: { credential: string }) => void;
        login_uri?: string;
        native_callback?: () => void;
        cancel_on_tap_outside?: boolean;
        prompt_parent_id?: string;
        nonce?: string;
        context?: string;
        state_cookie_domain?: string;
        ux_mode?: string;
        allowed_parent_origin?: string | string[];
        intermediate_iframe_close_callback?: () => void;
      }

      interface CredentialResponse {
        credential: string;
        select_by: string;
      }

      interface GsiButtonConfiguration {
        type?: 'standard' | 'icon';
        theme?: 'outline' | 'filled_blue' | 'filled_black';
        size?: 'large' | 'medium' | 'small';
        text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
        shape?: 'rectangular' | 'pill' | 'circle' | 'square';
        logo_alignment?: 'left' | 'center';
        width?: number | string;
        locale?: string;
      }

      function initialize(idConfiguration: IdConfiguration): void;
      function prompt(): void;
      function renderButton(
        parent: HTMLElement,
        options: GsiButtonConfiguration
      ): void;
      function disableAutoSelect(): void;
    }
  }
}
