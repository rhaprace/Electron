import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLongLeftIcon } from "@heroicons/react/24/solid";
const ContactUs = () => {
  const {
    register,
    trigger,
    formState: { errors },
  } = useForm();

  const onSubmit = async (e: any) => {
    const isValid = await trigger();
    if (!isValid) e.preventDefault();
  };
  const navigate = useNavigate();
  return (
    <>
      <ArrowLongLeftIcon
        onClick={() => navigate("/")}
        className="h-8 w-8  text-black transition duration-200 fixed left-0 ml-5 mt-5 block md:hidden z-50"
      />
      <section className="mx-auto w-11/12 max-w-6xl py-24 px-4 md:px-8 ">
        <motion.div
          className="rounded-3xl bg-gradient-to-br from-[#000059] to-[#D9D9D9] p-12 shadow-2xl "
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          variants={{
            hidden: { opacity: 0, y: 60 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-white">
            <div>
              <h2 className="text-4xl font-extrabold leading-snug mb-4">
                Contact Us
              </h2>
              <p className="text-lg leading-relaxed mb-8">
                We'd love to hear from you! Whether you have questions,
                feedback, or just want to say hello — feel free to reach out.
                Let’s connect and make something awesome together!
              </p>
            </div>
            <form
              onSubmit={onSubmit}
              action="https://formsubmit.co/e8fd48d6f4ba9f5b7a178bc3fdd44948"
              method="POST"
              className="space-y-6"
            >
              <div>
                <input
                  className="w-full rounded-lg bg-white/90 px-5 py-3 text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#000059]"
                  type="text"
                  placeholder="Name"
                  {...register("name", { required: true, maxLength: 100 })}
                />
                {errors.name && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.name.type === "required" &&
                      "This field is required."}
                    {errors.name.type === "maxLength" &&
                      "Max length is 100 characters."}
                  </p>
                )}
              </div>

              <div>
                <input
                  className="w-full rounded-lg bg-white/90 px-5 py-3 text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#000059]"
                  type="email"
                  placeholder="Email"
                  {...register("email", {
                    required: true,
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.email.type === "required" &&
                      "This field is required."}
                    {errors.email.type === "pattern" &&
                      "Invalid email address."}
                  </p>
                )}
              </div>

              <div>
                <textarea
                  className="w-full rounded-lg bg-white/90 px-5 py-3 text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#000059]"
                  placeholder="Message"
                  rows={5}
                  {...register("message", { required: true, maxLength: 2000 })}
                />
                {errors.message && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.message.type === "required" &&
                      "This field is required."}
                    {errors.message.type === "maxLength" &&
                      "Max length is 2000 characters."}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#000059] py-3 font-bold text-white transition-all hover:bg-white hover:text-[#000059] border-2 border-transparent hover:border-[#000059]"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default ContactUs;
