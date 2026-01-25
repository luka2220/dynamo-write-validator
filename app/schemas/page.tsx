"use client";

import { useState } from "react";
import { TableSchema } from "@/lib/types";
import { mockSchemas } from "@/lib/mock-data";
import { SchemaList } from "@/components/schemas/SchemaList";
import { SchemaEditor } from "@/components/schemas/SchemaEditor";

export default function SchemasPage() {
  const [schemas, setSchemas] = useState<TableSchema[]>(mockSchemas);
  const [selectedSchema, setSelectedSchema] = useState<TableSchema | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);

  const handleSelect = (schema: TableSchema) => {
    setSelectedSchema(schema);
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setSelectedSchema(null);
    setIsCreating(true);
  };

  const handleSave = (schema: TableSchema) => {
    const existingIndex = schemas.findIndex((s) => s.id === schema.id);
    if (existingIndex >= 0) {
      setSchemas(schemas.map((s) => (s.id === schema.id ? schema : s)));
    } else {
      setSchemas([...schemas, schema]);
    }
    setSelectedSchema(schema);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    setSchemas(schemas.filter((s) => s.id !== id));
    setSelectedSchema(null);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setSelectedSchema(null);
    setIsCreating(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">
          Schema Management
        </h1>
        <p className="text-text-secondary mt-1">
          Define and manage DynamoDB table schemas for validation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">
        <div>
          <SchemaList
            schemas={schemas}
            selectedId={selectedSchema?.id || null}
            onSelect={handleSelect}
            onCreateNew={handleCreateNew}
          />
        </div>

        <div>
          {selectedSchema || isCreating ? (
            <SchemaEditor
              key={selectedSchema?.id || "new"}
              schema={isCreating ? null : selectedSchema}
              onSave={handleSave}
              onDelete={handleDelete}
              onCancel={handleCancel}
            />
          ) : (
            <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-lg">
              <div className="text-center">
                <p className="text-text-secondary mb-2">
                  Select a schema to edit or create a new one
                </p>
                <button
                  onClick={handleCreateNew}
                  className="text-accent hover:text-accent-hover transition-colors"
                >
                  Create new schema
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
