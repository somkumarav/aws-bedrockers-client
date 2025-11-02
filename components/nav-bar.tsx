import { Activity } from "lucide-react";

export const NavBar = () => {
  return (
    <nav className='border-b bg-white dark:bg-zinc-950'>
      <div className='max-w-7xl mx-auto px-6 py-4'>
        <div className='flex items-center gap-2'>
          <Activity className='h-6 w-6 text-primary' />
          <h1 className='text-xl font-semibold text-zinc-900 dark:text-zinc-50'>
            AutoNet
          </h1>
        </div>
      </div>
    </nav>
  );
};
