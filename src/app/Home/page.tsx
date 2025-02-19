import AuthGuard from "@/components/auth/AuthGuard";


export default function page(){


  return (
      <>
        <AuthGuard/>
      </>
  )
}
