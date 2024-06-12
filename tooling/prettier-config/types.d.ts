declare module "prettier-plugin-tailwindcss" {
  export interface PluginOptions {
    /**
     * Path to the Tailwind config file.
     */
    tailwindConfig?: string;
    /**
     * Path to the Tailwind entry point (v4+)
     */
    tailwindEntryPoint?: string;
    /**
     * List of custom function and tag names that contain classes.
     */
    tailwindFunctions?: string[];
    /**
     * List of custom attributes that contain classes.
     */
    tailwindAttributes?: string[];
  }
}
