"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function About() {
  return (
    <main className="container mx-auto p-6 space-y-8 max-w-4xl">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="relative w-48 h-48 mx-auto">
          <Image
            src="/b61ef3cea897c4d0ffa24bf8a5e2f18e.jpg"
            alt="RAJ "
            fill
            className="object-cover rounded-full border-4 border-primary shadow-2xl"
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            RAJ
          </h1>
          <p className="text-xl text-muted-foreground">
            Web & App Developer
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              🌐 Web Developer
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              📱 App Developer
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              ⚛️ React
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">About Me</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg leading-relaxed">
            Hello, I&apos;m <strong>RAJ</strong>, a passionate web and app developer
            with a knack for turning complex problems into elegant solutions. My journey in the digital
            realm began with a curiosity for how things work behind the scenes, leading me to master
            the art of modern web technologies and mobile app development.
          </p>
          <p className="text-lg leading-relaxed">
            As a dedicated developer, I believe in using my skills for good – protecting
            systems, educating others, and building robust applications that stand the test of time.
            When I&apos;m not diving deep into code or exploring the latest security vulnerabilities, you can
            find me contributing to open-source projects or mentoring aspiring developers.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Expertise</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Frontend Development</li>
                <li>• Backend Development</li>
                <li>• Mobile App Development</li>
                <li>• UI/UX Design</li>
                <li>• API Development</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Technologies</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Python, JavaScript, TypeScript</li>
                <li>• React, Next.js, Node.js</li>
                <li>• Docker, Kubernetes</li>
                <li>• AWS, Azure Cloud</li>
                <li>• Linux, Bash Scripting</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Contact Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Get In Touch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Email: codewithevilxd@gmail.com
            
          </p>
        </CardContent>
      </Card>

      {/* Footer Quote */}
      <div className="text-center py-8">
        <blockquote className="text-lg italic text-muted-foreground border-l-4 border-primary pl-4">
          &quot;The best way to predict the future is to create it.&quot;
          <br />
          <cite className="text-sm font-semibold">- Peter Drucker</cite>
        </blockquote>
      </div>
    </main>
  );
}