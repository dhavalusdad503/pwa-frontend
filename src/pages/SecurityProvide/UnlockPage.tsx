// src/ui/UnlockPage.tsx
import { useSecurity } from '@pages/SecurityProvide';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';


export default function UnlockPage() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ password: string }>();
    const security = useSecurity();
    const nav = useNavigate();

    const onSubmit = async (d: { password: string }) => {
        try {
            await security.unlock(d.password);
            nav('/', { replace: true });
        } catch (err) {
            console.error(err);
            // Show UX error
            alert('Incorrect password');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-xl font-semibold mb-2">Unlock</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Password / PIN</label>
                    <input type="password" {...register('password', { required: true })} className="mt-1 w-full border rounded p-2" />
                    {errors.password && <p className="text-xs text-red-500">Password required</p>}
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={isSubmitting}>
                    {isSubmitting ? 'Unlocking...' : 'Unlock'}
                </button>
            </form>
        </div>
    );
}
