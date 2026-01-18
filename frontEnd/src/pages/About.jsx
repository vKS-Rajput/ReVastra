import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className='bg-gradient-to-b from-blue-50 to-blue-100' >
      {/* Title Section */}
      <div className='text-3xl font-bold text-center pt-8 pb-6 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      {/* About Content */}
      <div className='my-10 flex flex-col md:flex-row gap-10 items-center px-4 md:px-8'>
        <img
          className='w-full md:max-w-[450px] rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300'
          src={assets.about_img}
          alt="About Us"
        />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-700'>
          <p className='text-base leading-relaxed'>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facere eveniet, accusantium eum velit vel ea ut, similique, unde numquam sequi delectus! Tempore dignissimos vero debitis dicta qui, ad eaque natus quasi. Dolores praesentium, optio officiis distinctio facere explicabo tempore eius temporibus repellat nihil! Tempora, natus.
          </p>
          <p className='text-base leading-relaxed'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit veniam placeat iure temporibus adipisci dolorem aperiam minima quam assumenda, ad incidunt doloribus nemo, ea quis harum natus hic libero voluptates perspiciatis distinctio quibusdam laborum deleniti consequuntur? Labore nisi natus quos pariatur asperiores velit aspernatur beatae soluta, quas mollitia blanditiis molestias illo neque cupiditate odio.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className='text-3xl font-semibold py-4 text-center'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>
      <div className='flex flex-col md:flex-row gap-8 px-4 md:px-10'>
        {[
          {
            title: "India's First Platform",
            description: "India's first company providing a platform where users can lend their clothes, helping build a sustainable, sharing economy.",
          },
          {
            title: "Sustainability Focused",
            description: "We promote eco-friendly choices by encouraging re-use, helping reduce waste, and giving clothes a second life.",
          },
          {
            title: "Affordable Options",
            description: "Our platform enables users to rent high-quality clothes at affordable prices, making fashion accessible to all.",
          },
          {
            title: "Secure and Reliable",
            description: "We prioritize security and reliability, ensuring that every transaction is smooth and trustworthy.",
          },
          {
            title: "Community Driven",
            description: "Our community-based approach creates a space where everyone can benefit from shared resources and sustainable choices.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className='border-2 border-gray-300 bg-white shadow-lg p-8 rounded-lg flex flex-col gap-5 text-center transform hover:scale-105 transition-all duration-300'
          >
            <h3 className='font-semibold text-xl text-gray-800'>{item.title}</h3>
            <p className='text-sm text-gray-600'>{item.description}</p>
          </div>
        ))}
      </div>

      {/* Team Members Section */}
      <div className='text-center mt-14'>
        <h2 className='text-3xl font-semibold text-gray-800'>Our Team</h2>
        <p className='text-gray-600 mt-2'>Meet the people behind our success</p>

        <div className='flex flex-wrap justify-center gap-10 mt-10 px-4'>
          {[
            { name: "Founder", img: assets.founder_img },
            { name: "Developer", img: assets.developer_img },
            { name: "Designer", img: assets.designer_img },
            { name: "Marketing Lead", img: assets.marketing_img },
          ].map((teamMember, index) => (
            <div
              key={index}
              className='flex flex-col items-center text-center w-64 hover:transform hover:scale-110 transition-all duration-300'
            >
              <img
                src={teamMember.img}
                alt={teamMember.name}
                className='w-28 h-28 object-cover rounded-full shadow-md mb-4'
              />
              <h3 className='text-lg font-medium text-gray-800'>{teamMember.name}</h3>
              <p className='text-sm text-gray-500'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About;
