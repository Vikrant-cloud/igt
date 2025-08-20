export default function InputBox({ title, register, errors, inputType, type, placeholder }: { title: string, register: any, errors: any, inputType?: string, type?: string, placeholder?: string }) {
    return (
        <div>
            <label className="block text-sm font-medium">{title.toUpperCase()}</label>
            {
                inputType === 'textarea' ? (
                    <textarea
                        {...register(title, { required: true })}
                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                    />
                ) : <input
                    type={type || "text"}
                    {...register(title, { required: true })}
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                    placeholder={placeholder}
                />
            }

            {errors[title] && <p className="text-red-500 text-sm">{errors[title].message}</p>}
        </div>
    )
}