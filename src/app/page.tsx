//src/app/page.tsx
import Homepage from "@/app/Audit/page";
import AuthGuard from "@/components/auth/AuthGuard";

export default function Home() {
  return (
      <AuthGuard requiredPermission="admin">

          <div className="mockup-code">
              <pre data-prefix="1"><code>npm i daisyui</code></pre>
              <pre data-prefix="2"><code>installing...</code></pre>
              <pre data-prefix="3" className="bg-warning text-warning-content"><code>Error!</code></pre>
          </div>

      </AuthGuard>
  );
}
