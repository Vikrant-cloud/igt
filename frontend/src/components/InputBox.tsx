export default function InputBox({ title, register, errors, errorMsg, inputType, type }: { title: string, register: any, errors: any, errorMsg?: string, inputType?: string, type?: string }) {
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

                />
            }

            {errors[title] && <p className="text-red-500 text-sm">{errorMsg}</p>}
        </div>
    )
}