export default function SaveBtn({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full mt-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold py-3 rounded-xl transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Guardando..." : label}
    </button>
  );
}